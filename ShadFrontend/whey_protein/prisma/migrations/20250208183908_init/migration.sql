/*
  Warnings:

  - You are about to drop the column `forgotPasswordToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordTokenExpiry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verifyTokenExpiry` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `forgotPasswordToken`,
    DROP COLUMN `forgotPasswordTokenExpiry`,
    DROP COLUMN `isAdmin`,
    DROP COLUMN `isVerified`,
    DROP COLUMN `verifyToken`,
    DROP COLUMN `verifyTokenExpiry`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    INDEX `VerificationToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VerificationToken` ADD CONSTRAINT `VerificationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
