import Link from "next/link";
import { createDocument } from "@/app/actions/documents";

type DocumentItem = {
   id: string;
   title: string;
   content: string;
   updatedAt: Date;
};

type DocumentCardProps = {
   document?: DocumentItem;
   createNew?: boolean;
};

export default function DocumentCard({
   document,
   createNew = false,
}: DocumentCardProps) {

   // New document card
   if (createNew) {
      return (
         <form action={createDocument}>

            <button
               type="submit"
               className="group w-full text-left"
            >
               <div className="flex h-52 flex-col overflow-hidden rounded-lg border bg-white transition hover:border-blue-500 hover:shadow-md">

                  <div className="flex flex-1 items-center justify-center bg-gray-50">

                     <div className="text-center">

                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600">
                           +
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                           Blank document
                        </p>

                     </div>

                  </div>

               </div>
            </button>

         </form>
      );
   }

   // Existing document card
   if (!document) {
      return null;
   }

   return (
      <Link
         href={`/documents/${document.id}`}
         className="group"
      >
         <div className="flex h-52 flex-col overflow-hidden rounded-lg border bg-white transition hover:border-blue-500 hover:shadow-md">

            {/* Preview */}
            <div className="flex flex-1 items-center justify-center bg-gray-50">

               <div className="h-32 w-24 overflow-hidden border bg-white p-3 shadow-sm">

                  <div className="space-y-2">

                     <div className="h-1.5 w-full rounded bg-gray-200" />
                     <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                     <div className="h-1.5 w-full rounded bg-gray-200" />
                     <div className="h-1.5 w-3/5 rounded bg-gray-200" />

                  </div>

               </div>

            </div>

            {/* Info */}
            <div className="border-t p-3">

               <p className="truncate text-sm font-medium text-gray-700">
                  {document.title}
               </p>

               <p className="mt-1 text-xs text-gray-500">
                  {document.updatedAt.toLocaleDateString()}
               </p>

            </div>

         </div>
      </Link>
   );
}