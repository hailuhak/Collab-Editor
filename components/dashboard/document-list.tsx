import Link from "next/link";

type DocumentItem = {
   id: string;
   title: string;
   content: string;
   updatedAt: Date;
};

type DocumentListProps = {
   documents: DocumentItem[];
};

export default function DocumentList({
   documents,
}: DocumentListProps) {
   return (
      <section className="mt-12">

         <h2 className="mb-4 text-xl font-medium text-gray-800">
            My Documents
         </h2>

         {documents.length === 0 ? (

            <div className="rounded-lg border border-dashed p-12 text-center">

               <p className="text-gray-500">
                  You don't have any documents yet.
               </p>

               <p className="mt-2 text-sm text-gray-400">
                  Create a blank document to get started.
               </p>

            </div>

         ) : (

            <div className="overflow-hidden rounded-lg border">

               {/* Table Header */}

               <div className="grid grid-cols-12 border-b bg-gray-50 px-5 py-3 text-xs font-medium uppercase text-gray-500">

                  <div className="col-span-7">
                     Name
                  </div>

                  <div className="col-span-3">
                     Owner
                  </div>

                  <div className="col-span-2">
                     Last modified
                  </div>

               </div>

               {/* Documents */}

               {documents.map((document) => (

                  <Link
                     key={document.id}
                     href={`/documents/${document.id}`}
                     className="grid grid-cols-12 items-center border-b px-5 py-4 transition last:border-b-0 hover:bg-gray-50"
                  >

                     <div className="col-span-7 flex items-center gap-3">

                        <span className="text-lg">
                           📄
                        </span>

                        <span className="truncate text-sm font-medium text-gray-700">
                           {document.title}
                        </span>

                     </div>

                     <div className="col-span-3 text-sm text-gray-500">
                        You
                     </div>

                     <div className="col-span-2 text-sm text-gray-500">
                        {document.updatedAt.toLocaleDateString()}
                     </div>

                  </Link>

               ))}

            </div>

         )}

      </section>
   );
}