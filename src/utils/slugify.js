const slugify = (str) =>
  str
    ?.trim()
    ?.toLowerCase()
    // remove Bangla characters completely
    ?.replace(/[\u0980-\u09FF]+/g, '')
    // spaces → hyphen
    ?.replace(/\s+/g, '-')
    // remove non-word characters
    ?.replace(/[^\w\-]+/g, '')
    // multiple hyphen fix
    ?.replace(/\-\-+/g, '-')
    // remove leading/trailing hyphens
    ?.replace(/^-+|-+$/g, '');

export default slugify;