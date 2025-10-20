-- CreateTable
CREATE TABLE "ZerionSubscription" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "chainId" TEXT NOT NULL DEFAULT 'solana',
    "callbackUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZerionSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZerionSubscription_subscriptionId_key" ON "ZerionSubscription"("subscriptionId");

-- CreateIndex
CREATE INDEX "ZerionSubscription_userId_idx" ON "ZerionSubscription"("userId");

-- CreateIndex
CREATE INDEX "ZerionSubscription_walletAddress_idx" ON "ZerionSubscription"("walletAddress");

-- CreateIndex
CREATE INDEX "ZerionSubscription_subscriptionId_idx" ON "ZerionSubscription"("subscriptionId");

-- AddForeignKey
ALTER TABLE "ZerionSubscription" ADD CONSTRAINT "ZerionSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
