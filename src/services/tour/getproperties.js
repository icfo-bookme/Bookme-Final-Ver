const getproperties = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ships/${id}`,
      {
      next: { revalidate: 43200 },
    }
    );
    const data = await res.json(); 
    return data;
  } catch (error) {
    return [];
  }
};

export default getproperties;
