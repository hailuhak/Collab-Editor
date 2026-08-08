import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import RecentDocuments from "@/components/dashboard/recent-documents";
import DocumentList from "@/components/dashboard/document-list";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);

   if (!session?.user?.email) {
      redirect("/login");
   }

   const user = await prisma.user.findUnique({
      where: {
         email: session.user.email,
      },
      include: {
         documents: {
            orderBy: {
               updatedAt: "desc",
            },
         },
      },
   });

   if (!user) {
      redirect("/login");
   }

   return (
      <div className="min-h-screen bg-white">

         <DashboardHeader user={user} />

         <div className="mx-auto max-w-7xl px-6 py-8">

            <RecentDocuments documents={user.documents} />

            <DocumentList documents={user.documents} />

         </div>

      </div>
   );
}