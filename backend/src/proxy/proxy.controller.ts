// backend/src/proxy/proxy.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  @Get('universities')
  async getUniversities(@Query('country') country: string) {
    const response = await lastValueFrom(
      this.httpService.get(`https://universities.hipolabs.com/search?country=${country}`)
    );
    return response.data;
  }
}