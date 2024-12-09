import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ResponseInterceptor } from "response/response.interceptor";
import { Response } from "express";
import { Product } from "dto/product.dto";
import { ApiBody } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller("email")
@UseInterceptors(ResponseInterceptor)
export class AppController {
  constructor(private appService: AppService) {}

  @Post("send")
  @ApiBody({ type: [Product], description: "Lista di prodotti da inviare" })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendEmail(@Body() data: Product[]) {
    return this.appService.sendEmail(data);
  }
}
