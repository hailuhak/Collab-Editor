import { getDashboardDocuments } from "@/app/actions/documents";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const data = await getDashboardDocuments();

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A]">
      <DashboardHeader
        user={{
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        }}
      />
      <DashboardClient
        user={data.user}
        owned={data.owned}
        shared={data.shared}
        recent={data.recent}
      />
    </div>
  );
}
