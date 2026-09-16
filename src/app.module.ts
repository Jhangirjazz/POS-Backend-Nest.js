import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { SettingModule } from './setting/setting.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { InventoryModule } from './inventory/inventory.module';
import { CustomerModule } from './customer/customer.module';
import { BillingModule } from './billing/billing.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true}),
     PrismaModule,
     AuthModule,
     StoreModule,
     SettingModule,
     ProductModule,
     CategoryModule,
     InventoryModule,
     CustomerModule,
     BillingModule,
     
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
