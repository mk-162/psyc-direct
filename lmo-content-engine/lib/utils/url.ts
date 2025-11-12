export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export function normalizeUrl(url: string): string {
  let normalized = url.trim();

  // Add https:// if no protocol
  if (!normalized.match(/^https?:\/\//)) {
    normalized = 'https://' + normalized;
  }

  try {
    const parsedUrl = new URL(normalized);
    return parsedUrl.toString();
  } catch {
    return url;
  }
}
