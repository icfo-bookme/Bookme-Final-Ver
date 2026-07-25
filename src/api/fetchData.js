const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const DEFAULT_REVALIDATE = 43200; // 12 hours

/**
 * Build a URL with query parameters
 */
function buildUrl(endpoint, params) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') {
            url.searchParams.append(key, item);
          }
        });
      } else {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

/**
 * Core fetch function for SSR data fetching
 * @param {string} endpoint - API endpoint path (e.g. '/api/activities')
 * @param {object} options
 * @param {number} options.revalidate - Next.js revalidation time in seconds (default: 43200)
 * @param {object} options.params - Query parameters
 * @param {object} options.fetchOptions - Additional fetch options (e.g. { cache: 'no-store' })
 * @param {boolean} options.throwOnError - If true, throws instead of returning fallback
 * @returns {Promise<any>}
 */
async function fetchFromApi(endpoint, options = {}) {
  const {
    revalidate = DEFAULT_REVALIDATE,
    params,
    fetchOptions = {},
    throwOnError = false,
  } = options;

  const url = buildUrl(endpoint, params);

  const res = await fetch(url, {
    next: { revalidate },
    ...fetchOptions,
  });

  if (!res.ok) {
    if (throwOnError) {
      throw new Error(`API error: ${res.status} ${res.statusText} for ${endpoint}`);
    }
    console.error(`API error: ${res.status} ${res.statusText} for ${endpoint}`);
    return null;
  }

  return res.json();
}

/**
 * Fetch data and return the `.data` field or an empty array fallback
 * Use this when API returns { data: [...] }
 */
export async function fetchData(endpoint, options = {}) {
  try {
    const data = await fetchFromApi(endpoint, options);
    return data?.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

/**
 * Fetch data and return the full response or an empty array fallback
 * Use this when API returns a direct array/object
 */
export async function fetchJson(endpoint, options = {}) {
  try {
    const data = await fetchFromApi(endpoint, options);
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}