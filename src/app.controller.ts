import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ResponseInterceptor } from "response/response.interceptor";
import { Products } from "dto/product.dto";
import { AppService } from "./app.service";

@Controller("email")
@UseInterceptors(ResponseInterceptor)
export class AppController {
  constructor(private appService: AppService) {}

  @Post("send")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendEmail(@Body() data: Products) {
    return this.appService.sendEmail(data.products);
  }
}
