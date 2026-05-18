import CheckoutClient from "./CheckoutClient";
import { getCurrentUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const currentUser = await getCurrentUser().catch(() => null);
  return <CheckoutClient currentUser={currentUser} />;
}
