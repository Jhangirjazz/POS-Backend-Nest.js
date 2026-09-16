import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async getSetting(storeId: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { storeId },
      include: { store: true },
    });

    if (!setting) {
      return this.prisma.setting.create({
        data: {
          storeId,
          taxRate: 0,
          footerText: 'Thank you',
        },
        include: { store: true },
      });
    }

    return setting;
  }

  async updateSetting(storeId: string, dto: UpdateSettingDto) {
    return this.prisma.$transaction(async (tx) => {
      // Update Store name and logo
      await tx.store.update({
        where: { id: storeId },
        data: {
          name: dto.storeName,
          logo: dto.logo,
        },
      });

      // Update Setting tax and footer
      return tx.setting.upsert({
        where: { storeId },
        update: {
          taxRate: dto.taxRate,
          footerText: dto.footerText,
        },
        create: {
          storeId,
          taxRate: dto.taxRate || 0,
          footerText: dto.footerText || 'Thank you',
        },
        include: { store: true },
      });
    });
  }
}