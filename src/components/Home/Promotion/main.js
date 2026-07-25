export const runtime = 'edge';
import PromotionsPage from "./PromotionsPage";
import getPromotion from "@/services/homepage/getPromotion";

export const revalidate = 43200; 

export default async function PromotionsMain() {
  try {
    const promotions = await getPromotion();

    return <PromotionsPage promotions={promotions} />;
  } catch (error) {
    console.error("Promotion fetch error:", error);
    return <PromotionsPage promotions={[]} error={error.message} />;
  }
}
