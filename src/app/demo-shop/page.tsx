import { redirect } from "next/navigation";

// Demo shop is now at /services
export default function DemoShopRedirect() {
  redirect("/services");
}
