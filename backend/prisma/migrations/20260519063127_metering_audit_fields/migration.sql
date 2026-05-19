-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApiCallLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "apiId" TEXT,
    "subscriptionId" TEXT,
    "apiName" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApiCallLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ApiCallLog" ("apiId", "apiName", "createdAt", "id", "ipAddress", "responseTimeMs", "statusCode", "subscriptionId", "userId") SELECT "apiId", "apiName", "createdAt", "id", "ipAddress", "responseTimeMs", "statusCode", "subscriptionId", "userId" FROM "ApiCallLog";
DROP TABLE "ApiCallLog";
ALTER TABLE "new_ApiCallLog" RENAME TO "ApiCallLog";
CREATE INDEX "ApiCallLog_userId_apiId_idx" ON "ApiCallLog"("userId", "apiId");
CREATE INDEX "ApiCallLog_subscriptionId_idx" ON "ApiCallLog"("subscriptionId");
CREATE INDEX "ApiCallLog_createdAt_idx" ON "ApiCallLog"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
