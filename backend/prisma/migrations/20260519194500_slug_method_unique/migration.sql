DROP INDEX IF EXISTS "Api_slug_key";
CREATE UNIQUE INDEX "Api_slug_method_key" ON "Api"("slug", "method");
