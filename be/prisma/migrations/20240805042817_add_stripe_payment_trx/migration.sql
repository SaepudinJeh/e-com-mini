/*
  Warnings:

  - You are about to drop the column `snap_redirect_url` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `snap_token` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payment_intent_id` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "snap_redirect_url",
DROP COLUMN "snap_token",
DROP COLUMN "stripe_payment_intent_id",
ADD COLUMN     "stripe_redirect_url" VARCHAR(255);
