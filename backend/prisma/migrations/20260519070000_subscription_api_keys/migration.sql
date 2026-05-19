PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "totalQuota" INTEGER NOT NULL,
    "remainingQuota" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Subscription" (
    "id",
    "userId",
    "apiId",
    "purchaseId",
    "apiKey",
    "totalQuota",
    "remainingQuota",
    "status",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "userId",
    "apiId",
    "purchaseId",
    'ak_' || lower(hex(randomblob(24))),
    "totalQuota",
    "remainingQuota",
    "status",
    "createdAt",
    "updatedAt"
FROM "Subscription";

DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";

CREATE UNIQUE INDEX "Subscription_purchaseId_key" ON "Subscription"("purchaseId");
CREATE UNIQUE INDEX "Subscription_apiKey_key" ON "Subscription"("apiKey");
CREATE UNIQUE INDEX "Subscription_userId_apiId_key" ON "Subscription"("userId", "apiId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_apiId_idx" ON "Subscription"("apiId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
