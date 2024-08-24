export function formatNumber(value: number, locale = 'de-DE') {
  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}