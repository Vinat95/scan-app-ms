import { Body, Controller, Post, UseInterceptors, Res } from "@nestjs/common";
import { ResponseInterceptor } from "response/response.interceptor";
import * as Papa from "papaparse";
import * as nodemailer from "nodemailer";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Product } from "dto/product.dto";
import { ApiBody } from "@nestjs/swagger";

@Controller("email")
@UseInterceptors(ResponseInterceptor)
export class AppController {
  constructor(private configService: ConfigService) {}

  @Post("send")
  @ApiBody({ type: [Product] })
  async sendEmail(@Body() data: Product[], @Res() res: Response) {
    // Genera il CSV
    const csv = Papa.unparse(data);

    // Configura Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Usa il tuo provider
      auth: {
        user: this.configService.get<string>("MAIL_FROM"),
        pass: this.configService.get<string>("PROVIDER_PW"),
      },
    });

    // Configura l'email
    const mailOptions = {
      from: this.configService.get<string>("MAIL_FROM"),
      to: this.configService.get<string>("MAIL_TO"),
      subject: "Report negozi e prodotti",
      text: "In allegato trovi il report in formato CSV.",
      attachments: [
        {
          filename: "report.csv",
          content: csv,
        },
      ],
    };

    // Invia l'email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: "Email inviata con successo" });
    } catch (error) {
      res.status(500).send({ message: "Errore nell'invio della mail", error });
    }
  }
}
