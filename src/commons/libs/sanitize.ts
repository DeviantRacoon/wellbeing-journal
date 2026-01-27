export const sanitizeText = (text: string): string => {
  if (!text) return "";

  // 1. Trim whitespace
  // 2. Remove HTML tags to prevent stored XSS
  // We do NOT escape special chars (like / ' " &) because React renders them safely by default,
  // and escaping them causes them to show up as entities (e.g. &#x2F;) in the UI.
  return text.trim().replace(/<[^>]*>/g, ""); // Strip HTML tags
};
