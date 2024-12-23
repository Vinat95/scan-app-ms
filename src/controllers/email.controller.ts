import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Products } from "src/dto/product.dto";
import { ResponseInterceptor } from "src/response/response.interceptor";
import { EmailService } from "src/services/email.service";

@Controller("email")
@UseInterceptors(ResponseInterceptor)
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post("send")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendEmail(@Body() data: Products) {
    return this.emailService.send(data.products);
  }
}
