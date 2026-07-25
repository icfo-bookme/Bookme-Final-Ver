import { fetchJson } from '@/api/fetchData';

const propertySummary = async ({
  locationId,
  page = 1,
  sort = "popularity",
  minPrice = "",
  maxPrice = "",
  search = "",
}) => {
  try {
    return await fetchJson(`/api/ships/property/${locationId}`, {
      params: {
        page,
        per_page: 10,
        sort,
        min_price: minPrice,
        max_price: maxPrice,
        search,
      },
    });
  } catch (error) {
    return {
      data: [],
      pagination: {},
    };
  }
};

export default propertySummary;
