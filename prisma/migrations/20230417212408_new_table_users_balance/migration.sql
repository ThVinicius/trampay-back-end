-- CreateTable
CREATE TABLE "users_balance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_balance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_balance" ADD CONSTRAINT "users_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
