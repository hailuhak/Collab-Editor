import { redirect } from "next/navigation";

import { getDocumentForEditor, markDocumentOpened } from "@/app/actions/documents";
import DocumentEditor from "@/components/editor/document-editor";

type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;

  const data = await getDocumentForEditor(id);

  if (!data) {
    redirect("/login");
  }

  // Fire-and-forget: bump "recently opened".
  void markDocumentOpened(id);

  return (
    <DocumentEditor
      documentId={data.document.id}
      initialTitle={data.document.title}
      initialContent={data.document.content}
      role={data.role}
      ownerId={data.document.ownerId}
      user={data.user}
    />
  );
}
