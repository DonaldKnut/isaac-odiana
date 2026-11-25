import { AdminEditProvider } from "@/components/admin-edit-provider";
import { AdminPresenceBar } from "@/components/admin-presence-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappChat } from "@/components/whatsapp-chat";
import { getAdminSession } from "@/lib/admin-auth";
import {
  ensureCmsDefaults,
  getSiteSettings,
} from "@/lib/cms/content";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureCmsDefaults();
  const admin = await getAdminSession();
  const [settings, unread, recent] = await Promise.all([
    getSiteSettings(),
    admin ? getUnreadNotificationCount() : Promise.resolve(0),
    admin ? getRecentNotifications(12) : Promise.resolve([]),
  ]);

  const notifications = recent.map((item) => ({
    id: item.id,
    kind: item.kind,
    title: item.title,
    body: item.body,
    href: item.href,
    read: item.read,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <AdminEditProvider isAdmin={Boolean(admin)}>
      <CartProvider>
        {admin ? (
          <AdminPresenceBar
            email={admin.email}
            unread={unread}
            notifications={notifications}
          />
        ) : null}
        <SiteHeader adminOffset={Boolean(admin)} />
        <main className={`flex-1 pb-24 md:pb-0 ${admin ? "pt-10" : ""}`}>
          {children}
        </main>
        <SiteFooter settings={settings} />
        <WhatsappChat settings={settings} />
        <NewsletterPopup />
        <CartDrawer />
      </CartProvider>
    </AdminEditProvider>
  );
}
