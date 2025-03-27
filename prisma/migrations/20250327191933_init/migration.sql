/*
  Warnings:

  - Added the required column `productId` to the `ProductReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductReport` ADD COLUMN `productId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductReport` ADD CONSTRAINT `ProductReport_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
