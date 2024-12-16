import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ResponseInterceptor } from "./response/response.interceptor";
import { ResponseService } from "./response/response.service";
import { ResponseMiddleware } from "./response/response.middleware";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./services/email.service";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Imposta le variabili d'ambiente come globali
    }),
  ],
  controllers: [AppController],
  providers: [EmailService, ResponseService, ResponseInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
