-- AlterTable
ALTER TABLE "ZerionSubscription" ADD COLUMN     "zapId" TEXT;

-- CreateIndex
CREATE INDEX "ZerionSubscription_zapId_idx" ON "ZerionSubscription"("zapId");
