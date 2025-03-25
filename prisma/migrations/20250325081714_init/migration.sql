-- AlterTable
ALTER TABLE `Product` MODIFY `stock` INTEGER NOT NULL DEFAULT 0,
    MODIFY `discountPrice` DECIMAL(65, 30) NULL;
