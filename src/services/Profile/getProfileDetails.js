const getProfileDetails = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer-details/${id}`,
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

export default getProfileDetails;
