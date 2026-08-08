import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

import DocumentEditor from "@/components/editor/document-editor";

type DocumentPageProps = {
   params: Promise<{
      id: string;
   }>;
};

export default async function DocumentPage({
   params,
}: DocumentPageProps) {
   const session = await getServerSession(authOptions);

   if (!session?.user?.email) {
      redirect("/login");
   }

   const { id } = await params;

   const document = await prisma.document.findUnique({
      where: {
         id,
      },
   });

   if (!document) {
      notFound();
   }

   return (
      <DocumentEditor
         documentId={document.id}
         initialTitle={document.title}
         initialContent={document.content}
      />
   );
}