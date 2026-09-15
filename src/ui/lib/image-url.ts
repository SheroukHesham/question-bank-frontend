export function getQuestionImageSrc(
  headerImageUrl?: string,
): string | undefined {
  if (!headerImageUrl) return undefined;
  return `app-image://${headerImageUrl}`;
}
