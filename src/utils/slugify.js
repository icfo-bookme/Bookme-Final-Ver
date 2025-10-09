const slugify = (str) =>
  str
    ?.trim()
    ?.replace(/\s+/g, '-')
    ?.replace(/[^\w\-]+/g, '')
    ?.replace(/\-\-+/g, '-')

export default slugify;