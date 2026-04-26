export async function getSSRJson(endUrl, options = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        console.log(`Fetching SSR JSON from: ${BASE_URL}${endUrl}`);
  try {
    const res = await fetch(`${BASE_URL}/api${endUrl}`, {
      next: {
        revalidate: options.revalidate ?? 3600,
      },
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res}`);
    }

    return await res.json();
  } catch (error) {
    console.error("getSSRJson Error:", error);
    return [];
  }
}