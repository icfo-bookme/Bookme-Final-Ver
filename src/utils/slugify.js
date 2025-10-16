const slugify = (str) =>
  str
    ?.trim()
    ?.replace(/\s+/g, '-') 
    ?.replace(/[^\w\u0980-\u09FF\-]+/g, '') // 
    ?.replace(/\-\-+/g, '-') 

export default slugify;
