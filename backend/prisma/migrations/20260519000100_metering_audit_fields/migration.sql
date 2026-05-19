PRAGMA foreign_keys=OFF;

ALTER TABLE "Api" ADD COLUMN "dummyResponse" JSONB;

CREATE TABLE "new_ApiCallLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "apiId" TEXT,
    "subscriptionId" TEXT,
    "apiName" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApiCallLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApiCallLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_ApiCallLog" (
    "id",
    "userId",
    "apiId",
    "subscriptionId",
    "apiName",
    "statusCode",
    "responseTimeMs",
    "createdAt"
)
SELECT
    "ApiCallLog"."id",
    "ApiCallLog"."userId",
    "ApiCallLog"."apiId",
    "ApiCallLog"."subscriptionId",
    COALESCE("Api"."title", "Api"."slug", 'Unknown API') AS "apiName",
    "ApiCallLog"."statusCode",
    0 AS "responseTimeMs",
    "ApiCallLog"."createdAt"
FROM "ApiCallLog"
LEFT JOIN "Api" ON "Api"."id" = "ApiCallLog"."apiId";

DROP TABLE "ApiCallLog";
ALTER TABLE "new_ApiCallLog" RENAME TO "ApiCallLog";

CREATE INDEX "ApiCallLog_userId_apiId_idx" ON "ApiCallLog"("userId", "apiId");
CREATE INDEX "ApiCallLog_subscriptionId_idx" ON "ApiCallLog"("subscriptionId");
CREATE INDEX "ApiCallLog_createdAt_idx" ON "ApiCallLog"("createdAt");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
