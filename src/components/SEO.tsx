import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterHandle?: string;
  noIndex?: boolean;
}

export default function SEO({
  title = 'PrioLab - Community-Driven Issue Prioritization Platform',
  description = 'PrioLab is an open-source, community-driven platform for issue prioritization and project management. Help teams make data-driven decisions with collaborative voting and transparent prioritization frameworks.',
  keywords = 'issue prioritization, project management, community-driven, open source, collaborative voting, product prioritization framework, agile prioritization, feature prioritization',
  author = 'Imad Selka',
  image = '/og-image.png',
  url = 'https://priolab.devoria.me',
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const baseUrl = 'https://priolab.devoria.me';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
    </Helmet>
  );
}
