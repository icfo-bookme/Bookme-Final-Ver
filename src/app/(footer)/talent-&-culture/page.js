import DashboardLayout from '@/app/layout';
import getFooterPolicy from '@/services/tour/getFooterPolicy';

export const metadata = {
  title: "Talent & Culture Policy - BookMe",
  description: "Explore BookMe's Talent & Culture Policy, highlighting our commitment to fostering a diverse and inclusive workplace that values employee growth and well-being.",
  alternates: {
    canonical: "https://bookme.com.bd/talent-&-culture",
  },
};

const Page = async () => {
  let result = [];
  
  try {
    result = await getFooterPolicy();
    
  } catch (error) {
    console.error("Failed to fetch footer policy:", error);
  }

  return (
   
     
        <div className='pt-[100px] text-black'>
          <h1 className='text-4xl text-center font-heading font-bold'>{result[1]?.name}</h1>
          
          {result.length > 0 ? (
            <p className='text-center'>{result[1]?.value}</p>
          ) : (
            <p className='text-center text-red-500'>Failed to load policy content</p>
          )}
        </div>
     
    
  );
};

export default Page;