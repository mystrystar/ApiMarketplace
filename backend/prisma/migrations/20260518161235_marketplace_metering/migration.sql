-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "quota" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Purchase_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "totalQuota" INTEGER NOT NULL,
    "remainingQuota" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApiCallLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApiCallLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "pricePerCall" REAL NOT NULL DEFAULT 0,
    "defaultQuota" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Api_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Api" ("baseUrl", "category", "createdAt", "description", "id", "pricePerCall", "providerId", "status", "title", "updatedAt", "slug", "defaultQuota")
SELECT "baseUrl", "category", "createdAt", "description", "id", "pricePerCall", "providerId", "status", "title", "updatedAt", 'api-' || "id", 100 FROM "Api";
DROP TABLE "Api";
ALTER TABLE "new_Api" RENAME TO "Api";
CREATE UNIQUE INDEX "Api_slug_key" ON "Api"("slug");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt", "apiKey")
SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt", 'ak_' || lower(hex(randomblob(24))) FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_apiId_idx" ON "Purchase"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_purchaseId_key" ON "Subscription"("purchaseId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_apiId_idx" ON "Subscription"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_apiId_key" ON "Subscription"("userId", "apiId");

-- CreateIndex
CREATE INDEX "ApiCallLog_userId_apiId_idx" ON "ApiCallLog"("userId", "apiId");

-- CreateIndex
CREATE INDEX "ApiCallLog_subscriptionId_idx" ON "ApiCallLog"("subscriptionId");

-- CreateIndex
CREATE INDEX "ApiCallLog_createdAt_idx" ON "ApiCallLog"("createdAt");
