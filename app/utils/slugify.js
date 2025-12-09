//Helper function to create slugs from strings
export function slugify(text) {
  return text
    .toString()
    .normalize("NFD") //Remove any accents
    .replace(/[\u0300-\u036f]/g, "") // removes accents as well
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}