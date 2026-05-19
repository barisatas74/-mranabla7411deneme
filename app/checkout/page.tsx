import CheckoutClient from "./CheckoutClient";
import { getCurrentUser } from "@/lib/actions/auth";
import { listAddressesAction } from "@/lib/actions/addresses";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const currentUser = await getCurrentUser().catch(() => null);
  const savedAddresses = currentUser ? await listAddressesAction() : [];
  return (
    <CheckoutClient
      currentUser={currentUser}
      savedAddresses={savedAddresses}
    />
  );
}
