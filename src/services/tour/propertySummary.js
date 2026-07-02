const propertySummary = async ({
  locationId,
  page = 1,
  sort = "popularity",
  minPrice = "",
  maxPrice = "",
  search = "",
}) => {

  try {

    const params = new URLSearchParams({
      page,
      per_page: 10,
      sort,
      min_price: minPrice,
      max_price: maxPrice,
      search: search,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ships/property/${locationId}?${params}`,
      {
        next: { revalidate: 43200 },
      }
    );

    return await res.json();

  } catch (error) {

    return {
      data: [],
      pagination: {},
    };
  }
};

export default propertySummary;