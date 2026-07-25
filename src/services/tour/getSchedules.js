import { fetchJson } from '@/api/fetchData';

const getSchedules = async (id) => {
  return fetchJson(`/api/schedules/upcoming/${id}`);
};

export default getSchedules;