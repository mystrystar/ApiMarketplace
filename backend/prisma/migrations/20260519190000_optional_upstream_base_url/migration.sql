-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Api" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT,
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
INSERT INTO "new_Api" ("baseUrl", "category", "createdAt", "defaultQuota", "deletedAt", "description", "dummyResponse", "id", "pricePerCall", "providerId", "slug", "status", "title", "updatedAt") SELECT "baseUrl", "category", "createdAt", "defaultQuota", "deletedAt", "description", "dummyResponse", "id", "pricePerCall", "providerId", "slug", "status", "title", "updatedAt" FROM "Api";
DROP TABLE "Api";
ALTER TABLE "new_Api" RENAME TO "Api";
CREATE UNIQUE INDEX "Api_slug_key" ON "Api"("slug");
CREATE INDEX "Api_deletedAt_idx" ON "Api"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
