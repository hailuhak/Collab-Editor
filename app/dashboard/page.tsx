import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createDocument } from "@/app/actions/documents";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);

   // Protect dashboard
   if (!session?.user?.email) {
      redirect("/login");
   }

   // Get current user
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
      <main className="min-h-screen bg-gray-50 p-8 transition-colors dark:bg-gray-950">
         <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                     Welcome back, {user.name || "User"}
                  </h1>

                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                     Manage your documents and collaborate with your team.
                  </p>
               </div>

               {/* Create document */}
               <form action={createDocument}>
                  <input
                     type="hidden"
                     name="title"
                     value="Untitled Document"
                  />

                  <button
                     type="submit"
                     className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                     <Plus className="h-4 w-4" strokeWidth={2.5} />
                     New Document
                  </button>
               </form>
            </div>

            {/* Documents */}
            <section>
               <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  My Documents
               </h2>

               {user.documents.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                        <FileText className="h-5 w-5" />
                     </div>

                     <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        No documents yet
                     </h3>

                     <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Create your first document to get started.
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {user.documents.map((document) => (
                        <a
                           key={document.id}
                           href={`/documents/${document.id}`}
                           className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800"
                        >
                           <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:group-hover:bg-indigo-900/60">
                                 <FileText className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                 <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                    {document.title}
                                 </h3>

                                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Last updated{" "}
                                    {document.updatedAt.toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                        </a>
                     ))}
                  </div>
               )}
            </section>

         </div>
      </main>
   );
}