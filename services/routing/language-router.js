const SUPPORTED_LANGUAGES = new Set(['en','bg','de','fr','es','it','nl','pl','ro','el']);
const DEFAULT_LANGUAGE = 'en';

export function normalizeLanguage(value) {
  if (!value) return null;
  const base = String(value).trim().toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.has(base) ? base : null;
}

export function resolveLanguage({ explicit, cookie, acceptLanguage } = {}) {
  for (const candidate of [explicit, cookie]) {
    const resolved = normalizeLanguage(candidate);
    if (resolved) return resolved;
  }
  for (const part of String(acceptLanguage || '').split(',')) {
    const [tag] = part.trim().split(';');
    const resolved = normalizeLanguage(tag);
    if (resolved) return resolved;
  }
  return DEFAULT_LANGUAGE;
}

export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES };
