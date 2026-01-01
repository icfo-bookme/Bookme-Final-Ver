const getVisaDetails = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/propertySummary/4/${id}`, {
          next: { revalidate: 43200 },
        }
      );
      const propertyPackages = await response.json();      
      return propertyPackages;
    } catch (error) {
      return [];
    }
  };
  
  export default getVisaDetails;