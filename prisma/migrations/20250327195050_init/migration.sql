-- AlterTable
ALTER TABLE `StockReport` ADD COLUMN `productId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `StockReport` ADD CONSTRAINT `StockReport_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
