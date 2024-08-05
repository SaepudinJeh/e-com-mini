-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "customer_name" SET DATA TYPE TEXT,
ALTER COLUMN "customer_email" SET DATA TYPE TEXT,
ALTER COLUMN "payment_method" SET DATA TYPE TEXT,
ALTER COLUMN "stripe_redirect_url" SET DATA TYPE TEXT;
