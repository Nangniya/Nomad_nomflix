export function makeImagePath(id: string, format?: string): string {
  if (id === "") return "http://placehold.co/200";
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
