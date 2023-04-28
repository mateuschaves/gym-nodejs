/*
  Warnings:

  - You are about to drop the column `userId` on the `check_ins` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `gyms` table. All the data in the column will be lost.
  - Added the required column `gym_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_userId_fkey";

-- AlterTable
ALTER TABLE "check_ins" DROP COLUMN "userId",
ADD COLUMN     "gym_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "address";

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
