import Head from "next/head";

interface SeoProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION =
  "PaM: Tu diario personal y asistente de bienestar emocional. Monitorea tu estado de ánimo, recibe diagnósticos preventivos y cuida tu salud mental.";

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  noIndex = false,
}: SeoProps) => {
  const fullTitle = `${title} | PaM App`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="PaM App" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};
