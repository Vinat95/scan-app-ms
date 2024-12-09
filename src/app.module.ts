import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ResponseInterceptor } from "response/response.interceptor";
import { ResponseService } from "response/response.service";
import { ResponseMiddleware } from "response/response.middleware";
import { HttpModule } from "@nestjs/axios";
import { S3Service } from "./aws s3/s3.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Imposta le variabili d'ambiente come globali
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ResponseService, ResponseInterceptor, S3Service],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
