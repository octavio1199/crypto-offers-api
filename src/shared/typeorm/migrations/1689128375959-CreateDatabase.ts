import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1689128375959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "email" text,
        "account_number" text,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now()
      );
      
      CREATE TABLE "wallets" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "account_id" int,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now()
      );
      
      CREATE TABLE "coins" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "name" text,
        "code" text,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now()
      );
      
      CREATE TABLE "coin_balances" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "wallet_id" int,
        "coin_id" int,
        "balance" decimal,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now()
      );
      
      CREATE TABLE "offers" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "seller_account_id" int,
        "buyer_account_id" int,
        "coin_id" int,
        "wallet_id" int,
        "unit_price" decimal,
        "total_price" decimal,
        "quantity" decimal,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "deleted_at" timestamptz
      );
      
      ALTER TABLE "wallets" ADD FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");
      
      ALTER TABLE "coin_balances" ADD FOREIGN KEY ("wallet_id") REFERENCES "wallets" ("id");
      
      ALTER TABLE "coin_balances" ADD FOREIGN KEY ("coin_id") REFERENCES "coins" ("id");
      
      ALTER TABLE "offers" ADD FOREIGN KEY ("seller_account_id") REFERENCES "accounts" ("id");
      
      ALTER TABLE "offers" ADD FOREIGN KEY ("buyer_account_id") REFERENCES "accounts" ("id");
      
      ALTER TABLE "offers" ADD FOREIGN KEY ("coin_id") REFERENCES "coins" ("id");
      
      ALTER TABLE "offers" ADD FOREIGN KEY ("wallet_id") REFERENCES "wallets" ("id");
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('crypto_offers');
  }
}
