/*
  Warnings:

  - You are about to drop the column `resetToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_resetToken_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpiry`;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    INDEX `PasswordResetToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
