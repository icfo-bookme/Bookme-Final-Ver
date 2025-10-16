export const runtime = 'edge';
import PromotionsPage from "./PromotionsPage";

export const revalidate = 43200; 

export default async function PromotionsMain() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/homepage/hot-package`, {
      next: { revalidate: 43200 },
    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const result = await res.json();
    const promotions = result.data || [];

    return <PromotionsPage promotions={promotions} />;
  } catch (error) {
    console.error("Promotion fetch error:", error);
    return <PromotionsPage promotions={[]} error={error.message} />;
  }
}
