import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSetting(@Req() req: any) {
    return this.settingService.getSetting(req.user.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateSetting(@Req() req: any, @Body() dto: UpdateSettingDto) {
    return this.settingService.updateSetting(req.user.storeId, dto);
  }
}