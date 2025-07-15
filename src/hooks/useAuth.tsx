
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const updateProfileFromGitHub = async (user: User, githubToken: string) => {
    try {
      // Fetch complete GitHub user data
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const githubUser = await response.json();
        
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const profileData = {
          user_id: user.id,
          github_id: githubUser.id,
          github_username: githubUser.login,
          name: githubUser.name || githubUser.login,
          email: githubUser.email || user.email,
          avatar_url: githubUser.avatar_url,
          bio: githubUser.bio,
          location: githubUser.location,
          company: githubUser.company,
          blog: githubUser.blog,
          twitter_username: githubUser.twitter_username,
          public_repos: githubUser.public_repos || 0,
          public_gists: githubUser.public_gists || 0,
          followers: githubUser.followers || 0,
          following: githubUser.following || 0,
          github_created_at: githubUser.created_at,
        };

        let error;
        if (existingProfile) {
          // Update existing profile
          const result = await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', user.id);
          error = result.error;
        } else {
          // Insert new profile
          const result = await supabase
            .from('profiles')
            .insert(profileData);
          error = result.error;
        }

        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log('Profile updated successfully with GitHub data');
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Update profile when user signs in with GitHub
        if (event === 'SIGNED_IN' && session?.provider_token && session?.user) {
          setTimeout(() => {
            updateProfileFromGitHub(session.user, session.provider_token!);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    const redirectUrl = `${window.location.origin}/`;
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        scopes: 'repo user'
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGitHub,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
