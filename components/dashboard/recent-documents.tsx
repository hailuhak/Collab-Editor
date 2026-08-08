import DocumentCard from "./document-card";

type DocumentItem = {
   id: string;
   title: string;
   content: string;
   updatedAt: Date;
};

type RecentDocumentsProps = {
   documents: DocumentItem[];
};

export default function RecentDocuments({
   documents,
}: RecentDocumentsProps) {
   const recentDocuments = documents.slice(0, 4);

   return (
      <section>

         <h1 className="mb-5 text-xl font-medium text-gray-800">
            Recent documents
         </h1>

         <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            <DocumentCard createNew />

            {recentDocuments.map((document) => (
               <DocumentCard
                  key={document.id}
                  document={document}
               />
            ))}

         </div>

      </section>
   );
}