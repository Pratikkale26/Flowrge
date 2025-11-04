-- CreateTable
CREATE TABLE "NonceAccount" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "flowKey" TEXT NOT NULL,
    "noncePubkey" TEXT NOT NULL,
    "authorityPubkey" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'devnet',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NonceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DurableTransaction" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "flowKey" TEXT NOT NULL,
    "nonceAccountId" TEXT NOT NULL,
    "transfers" JSONB NOT NULL,
    "platformFeeLamports" BIGINT NOT NULL DEFAULT 0,
    "feePayerPubkey" TEXT NOT NULL,
    "serializedTxB64" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "DurableTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NonceAccount_noncePubkey_key" ON "NonceAccount"("noncePubkey");

-- CreateIndex
CREATE INDEX "NonceAccount_zapId_idx" ON "NonceAccount"("zapId");

-- CreateIndex
CREATE INDEX "NonceAccount_flowKey_idx" ON "NonceAccount"("flowKey");

-- CreateIndex
CREATE INDEX "DurableTransaction_zapId_idx" ON "DurableTransaction"("zapId");

-- CreateIndex
CREATE INDEX "DurableTransaction_flowKey_idx" ON "DurableTransaction"("flowKey");

-- CreateIndex
CREATE INDEX "DurableTransaction_nonceAccountId_idx" ON "DurableTransaction"("nonceAccountId");

-- CreateIndex
CREATE INDEX "DurableTransaction_status_idx" ON "DurableTransaction"("status");

-- AddForeignKey
ALTER TABLE "NonceAccount" ADD CONSTRAINT "NonceAccount_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DurableTransaction" ADD CONSTRAINT "DurableTransaction_nonceAccountId_fkey" FOREIGN KEY ("nonceAccountId") REFERENCES "NonceAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DurableTransaction" ADD CONSTRAINT "DurableTransaction_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
