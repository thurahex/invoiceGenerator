/*
  Warnings:

  - You are about to drop the column `customerName` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrate existing customer data
INSERT INTO `Customer` (`name`, `updatedAt`)
SELECT DISTINCT `customerName`, CURRENT_TIMESTAMP(3)
FROM `invoice`;

-- Add customerId column and update with corresponding customer ids
ALTER TABLE `invoice` ADD COLUMN `customerId` INTEGER;
UPDATE `invoice` i
JOIN `Customer` c ON i.customerName = c.name
SET i.customerId = c.id;

-- Make customerId required and drop customerName
ALTER TABLE `invoice` MODIFY COLUMN `customerId` INTEGER NOT NULL;
ALTER TABLE `invoice` DROP COLUMN `customerName`;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
