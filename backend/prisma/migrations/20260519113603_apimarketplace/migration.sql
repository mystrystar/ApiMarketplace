/*
  Warnings:

  - You are about to alter the column `pricePerCall` on the `Api` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `amount` on the `Purchase` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - Added the required column `apiKeyHash` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Api" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT NOT NULL,
    "category" TEXT,
    "pricePerCall" DECIMAL NOT NULL DEFAULT 0,
    "defaultQuota" INTEGER NOT NULL DEFAULT 100,
    "dummyResponse" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Api_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Api" ("baseUrl", "category", "createdAt", "defaultQuota", "description", "dummyResponse", "id", "pricePerCall", "providerId", "slug", "status", "title", "updatedAt") SELECT "baseUrl", "category", "createdAt", "defaultQuota", "description", "dummyResponse", "id", "pricePerCall", "providerId", "slug", "status", "title", "updatedAt" FROM "Api";
DROP TABLE "Api";
ALTER TABLE "new_Api" RENAME TO "Api";
CREATE UNIQUE INDEX "Api_slug_key" ON "Api"("slug");
CREATE INDEX "Api_deletedAt_idx" ON "Api"("deletedAt");
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "quota" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Purchase_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("amount", "apiId", "createdAt", "id", "quota", "userId") SELECT "amount", "apiId", "createdAt", "id", "quota", "userId" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");
CREATE INDEX "Purchase_apiId_idx" ON "Purchase"("apiId");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "totalQuota" INTEGER NOT NULL,
    "remainingQuota" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("apiId", "apiKey", "apiKeyHash", "createdAt", "id", "purchaseId", "remainingQuota", "status", "totalQuota", "updatedAt", "userId") SELECT "apiId", "apiKey", "apiKey", "createdAt", "id", "purchaseId", "remainingQuota", "status", "totalQuota", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_purchaseId_key" ON "Subscription"("purchaseId");
CREATE UNIQUE INDEX "Subscription_apiKey_key" ON "Subscription"("apiKey");
CREATE UNIQUE INDEX "Subscription_apiKeyHash_key" ON "Subscription"("apiKeyHash");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_apiId_idx" ON "Subscription"("apiId");
CREATE INDEX "Subscription_apiKeyHash_idx" ON "Subscription"("apiKeyHash");
CREATE UNIQUE INDEX "Subscription_userId_apiId_key" ON "Subscription"("userId", "apiId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
