import { fetchJson } from '@/api/fetchData';

export default async function getActivitiesList({ id, searchParams = {} }) {
  const params = {};

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          const existing = params[key];
          if (existing) {
            params[key] = Array.isArray(existing) ? [...existing, item] : [existing, item];
          } else {
            params[key] = item;
          }
        }
      });
    } else {
      params[key] = value;
    }
  });

  return fetchJson(`/api/activities/propertyList/${id}`, {
    params,
    throwOnError: true,
  });
}
