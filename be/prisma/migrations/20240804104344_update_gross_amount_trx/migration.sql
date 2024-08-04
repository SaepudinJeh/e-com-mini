/*
  Warnings:

  - You are about to drop the column `total` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `gross_amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "total",
ADD COLUMN     "gross_amount" DOUBLE PRECISION NOT NULL;
