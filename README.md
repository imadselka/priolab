# 🚀 PrioLab

**Community-driven GitHub issue prioritization platform**

PrioLab is a modern web application that helps developers discover, prioritize, and collaborate on GitHub issues through community voting and intelligent ranking algorithms.

![Built with React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-blue?logo=tailwindcss)

## ✨ Features

### 🔍 **Repository Discovery**
- Search and discover trending GitHub repositories
- Filter by programming language and time periods
- Track popular open-source projects
- Real-time repository statistics and metrics

### 🗳️ **Issue Prioritization**
- Community-driven voting system for GitHub issues
- Intelligent priority rankings based on multiple factors
- Visual vote counts and trend indicators
- Smart algorithm considering vote velocity, age, and engagement

### 💬 **Enhanced Discussions**
- Dual comment system (GitHub + Platform comments)
- Emoji reactions for issues and comments
- Threaded reply support
- Rich markdown formatting

### 🔗 **Seamless GitHub Integration**
- OAuth authentication with GitHub
- Real-time sync with GitHub repositories and issues
- Respect for GitHub API rate limits
- Access to public repository data only

### 📊 **Advanced Analytics**
- User statistics and contribution tracking
- Repository metrics and trends
- Issue engagement analytics
- Community activity insights

### 🎨 **Modern User Experience**
- Responsive design for all devices
- Dark/light theme support
- Intuitive navigation and search
- Progressive Web App capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### External APIs
- **GitHub API v3** - Repository and issue data
- **GitHub OAuth** - User authentication

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **PNPM** - Fast package manager

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PNPM package manager
- GitHub account for authentication
- Supabase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/issue-priority-forge.git
   cd issue-priority-forge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
   ```

4. **Database Setup**
   - Run Supabase migrations:
   ```bash
   npx supabase migration up
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### GitHub OAuth Setup

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`
3. Copy the Client ID to your `.env.local` file

### Supabase Configuration

1. Create a new Supabase project
2. Copy the project URL and anon key to your `.env.local`
3. Enable GitHub OAuth in Supabase Auth settings
4. Run the database migrations from the `supabase/migrations` directory

## 📖 Usage

### For Developers

1. **Sign in with GitHub** - Authenticate using your GitHub account
2. **Discover Repositories** - Browse trending repositories or search for specific projects
3. **Follow Repositories** - Track repositories you're interested in
4. **Vote on Issues** - Help prioritize important issues in projects you care about
5. **Join Discussions** - Participate in community discussions about development priorities

### For Project Maintainers

1. **Monitor Community Interest** - See which issues your community considers most important
2. **Understand Priorities** - Use vote data to inform your roadmap decisions
3. **Engage with Users** - Participate in discussions about feature requests and bugs
4. **Track Trends** - Analyze voting patterns and community engagement

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives (shadcn/ui)
│   ├── issue-detail/   # Issue detail page components
│   └── ...
├── hooks/              # Custom React hooks
│   ├── queries/        # React Query hooks
│   ├── mutations/      # Data mutation hooks
│   └── ...
├── pages/              # Route components
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── integrations/       # External service integrations
    └── supabase/       # Supabase client and types

supabase/
├── migrations/         # Database schema migrations
└── config.toml        # Supabase configuration
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint

# Database
npx supabase start    # Start local Supabase
npx supabase stop     # Stop local Supabase
npx supabase reset    # Reset local database
```

## 🌟 Key Features in Detail

### Community Voting System
- **One vote per user per issue** - Ensures fair representation
- **Vote changing** - Users can modify their votes as priorities change
- **Aggregate scoring** - Combines votes with other factors for intelligent ranking

### GitHub Integration
- **OAuth Authentication** - Secure login with GitHub credentials
- **Repository Syncing** - Automatic sync of public repository data
- **Issue Tracking** - Real-time issue status and metadata updates
- **Rate Limit Respect** - Intelligent API usage to stay within GitHub limits

### Real-time Features
- **Live Comments** - Real-time comment updates using Supabase subscriptions
- **Vote Updates** - Instant vote count updates across all users
- **Issue Status** - Live GitHub issue status synchronization

## 🔒 Privacy & Security

- **Public Data Only** - Only accesses public GitHub repositories and issues
- **No Credential Storage** - GitHub tokens are never stored permanently
- **Row Level Security** - Database access controlled by Supabase RLS policies
- **Secure Authentication** - OAuth flow handled by Supabase Auth

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Follow conventional commit messages
- Add JSDoc comments for public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) - For providing excellent developer APIs
- [Supabase](https://supabase.com) - For the amazing backend-as-a-service platform
- [shadcn/ui](https://ui.shadcn.com) - For the beautiful component library
- [Radix UI](https://www.radix-ui.com) - For accessible component primitives
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework

## 📞 Support

- 📧 Email: support@priolab.dev
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/issue-priority-forge/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/issue-priority-forge/issues)
- 📖 Documentation: [docs.priolab.dev](https://docs.priolab.dev)

---

**Made with ❤️ by the PrioLab Team**

*Empowering developers to build better software through community-driven prioritization.*
