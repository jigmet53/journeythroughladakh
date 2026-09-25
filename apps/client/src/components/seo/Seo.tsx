import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** JSON-LD structured data object(s) — BRD.md §38 (TouristDestination, BreadcrumbList, WebSite, etc.). */
  jsonLd?: object | object[];
}

const SITE_NAME = 'Journey Through Ladakh';

/** Centralizes BRD.md §37's per-page requirements (unique title, meta
 * description, canonical URL, OG, Twitter) so every page sets them the same
 * way. Canonical/OG URLs use the current origin at runtime rather than a
 * hardcoded domain — correct wherever this is actually deployed. */
export function Seo({ title, description, path, image, jsonLd }: SeoProps) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLdList.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
