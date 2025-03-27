/*
  Warnings:

  - You are about to drop the column `membershipDiscount` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `remainingSub` on the `Member` table. All the data in the column will be lost.
  - Added the required column `TimeLeft` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberDiscount` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Member` DROP COLUMN `membershipDiscount`,
    DROP COLUMN `remainingSub`,
    ADD COLUMN `TimeLeft` VARCHAR(191) NOT NULL,
    ADD COLUMN `memberDiscount` DECIMAL(65, 30) NOT NULL;
