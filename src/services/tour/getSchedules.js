const getSchedules = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/upcoming/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
};

export default getSchedules;