import { redirect } from "next/navigation";
import { AdminLoginView } from "@/components/admin-login-view";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return <AdminLoginView />;
}
