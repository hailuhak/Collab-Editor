-- AlterEnum
ALTER TYPE "PermissionRole" ADD VALUE 'COMMENTER';

-- AlterTable
ALTER TABLE "Comment"
    ADD COLUMN "parentId" TEXT,
    ADD COLUMN "resolved" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "resolvedAt" TIMESTAMP(3),
    ADD COLUMN "resolvedById" TEXT,
    ADD COLUMN "selection" TEXT;

-- AlterTable
ALTER TABLE "Document"
    ADD COLUMN "lastModifiedById" TEXT,
    ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
-- Add an author to every existing version, defaulting to the document owner.
ALTER TABLE "Version" ADD COLUMN "authorId" TEXT;

UPDATE "Version" v
SET "authorId" = d."ownerId"
FROM "Document" d
WHERE d."id" = v."documentId";

ALTER TABLE "Version" ALTER COLUMN "authorId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Document_lastModifiedById_idx" ON "Document"("lastModifiedById");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_lastModifiedById_fkey" FOREIGN KEY ("lastModifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
