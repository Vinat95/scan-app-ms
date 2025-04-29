import {
  Body,
  Controller,
  Post,
  RequestTimeoutException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { GptDto } from "src/dto/gpt.dto";
import { Products } from "src/dto/product.dto";
import { ResponseInterceptor } from "src/response/response.interceptor";
import { EmailService } from "src/services/email.service";

@Controller("email")
@UseInterceptors(ResponseInterceptor)
export class EmailController {
  constructor(private emailService: EmailService) {}

  // @Post("send")
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // async sendEmail(@Body() data: Products) {
  //   return this.emailService.send(data.products);
  // }

  @Post("send")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendEmail(@Body() data: Products) {
    return await Promise.race([
      this.emailService.send(data.products),
      this.timeoutAfter(20000), // 20 secondi
    ]);
  }

  private timeoutAfter(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new RequestTimeoutException(
              "Timeout interno: l'invio ha impiegato troppo tempo"
            )
          ),
        ms
      )
    );
  }

  // @Post("askGPT")
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // async askGPT(@Body() data: GptDto) {
  //   return this.emailService.askChatGPT(data);
  // }
}
