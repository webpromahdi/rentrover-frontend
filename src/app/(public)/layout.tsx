import type { ReactNode } from "react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import { getHeaderUser } from "@/lib/getHeaderUser";

const PublicLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const user = await getHeaderUser();

  return (
    <div className="flex min-h-screen flex-col font-[Inter] text-foreground">
      <SiteHeader user={user} />
      <main id="main-content" className="flex-1 bg-slate-50/50">{children}</main>

      <SiteFooter />
    </div>
  );
};

export default PublicLayout;
