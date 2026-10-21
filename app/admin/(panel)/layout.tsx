import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/admin/auth";
import { initials } from "@/lib/admin/format";
import { navCounts } from "@/lib/admin/queries";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const counts = await navCounts();
  return (
    <div className="adm">
      <Sidebar name={me.name} initials={initials(me.name)} newApps={counts.newApps} newInquiries={counts.newInquiries} />
      {children}
    </div>
  );
}
