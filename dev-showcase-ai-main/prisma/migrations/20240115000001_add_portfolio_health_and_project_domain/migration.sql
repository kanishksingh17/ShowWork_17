-- AddPortfolioHealthAndProjectDomain
-- Add healthJson field to Portfolio table
ALTER TABLE "portfolios" ADD COLUMN "healthJson" JSONB;

-- Add domain field to Project table  
ALTER TABLE "projects" ADD COLUMN "domain" TEXT;
