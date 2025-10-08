import PromotionsPage from "./PromotionsPage";

export default async function PromotionsMain() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/homepage/hot-package`,
      { 
        next: { 
          revalidate: 43200
        } 
      } 
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const promotions = result.data || [];

    return (
      <div>
        <PromotionsPage promotions={promotions} />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <PromotionsPage promotions={[]} error={error.message} />
      </div>
    );
  }
}