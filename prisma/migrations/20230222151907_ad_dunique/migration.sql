/*
  Warnings:

  - A unique constraint covering the columns `[auth_email]` on the table `auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `auth_auth_email_key` ON `auth`(`auth_email`);
