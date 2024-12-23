import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ResponseInterceptor } from "./response/response.interceptor";
import { ResponseService } from "./response/response.service";
import { ResponseMiddleware } from "./response/response.middleware";
import { HttpModule } from "@nestjs/axios";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./services/email.service";
import { EmailController } from "./controllers/email.controller";
import { memoryStorage } from "multer";
import { UploadController } from "./controllers/s3.controller";
import { S3Service } from "./services/s3.service";

@Module({
  imports: [
    HttpModule,
    MulterModule.register({
      storage: memoryStorage(), // Usa memoryStorage per ottenere file.buffer
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Imposta le variabili d'ambiente come globali
    }),
  ],
  controllers: [EmailController, UploadController],
  providers: [EmailService, ResponseService, ResponseInterceptor, S3Service],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
