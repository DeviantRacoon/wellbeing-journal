export const getMinioImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Use public endpoint if available, otherwise fallback to configured endpoint
  // In many setups, MINIO_ENDPOINT might be internal (e.g. 'minio:9000') while we need a public URL for the browser.
  // Ideally, there should be a NEXT_PUBLIC_MINIO_URL or similar.
  // For now, we will use MINIO_ENDPOINT assuming it is accessible (like localhost:9000)

  const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
  const bucket = process.env.MINIO_BUCKET_NAME || "media";

  // Remove trailing headers from endpoint if present
  const cleanEndpoint = endpoint.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return `${cleanEndpoint}/${bucket}/${cleanPath}`;
};
