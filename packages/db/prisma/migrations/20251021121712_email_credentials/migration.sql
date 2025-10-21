-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailAccessToken" TEXT,
ADD COLUMN     "emailProvider" TEXT,
ADD COLUMN     "emailRefreshToken" TEXT;
