import { Injectable } from "@nestjs/common";
import * as Papa from "papaparse";
import * as nodemailer from "nodemailer";
import { Product } from "../dto/product.dto";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { GptDto } from "src/dto/gpt.dto";

@Injectable()
export class EmailService {
  private readonly apiKeyGPT = this.configService.get<string>("GPT_API_KEY");
  constructor(private configService: ConfigService) {}

  async send(data: Product[]) {
    try {
      const transformedData = data.map((item) => {
        return {
          "Nome Negozio": item.shopName,
          "Localita\'": item.location,
          "Codice Utente": item.userCode,
          EAN: item.ean,
          Prezzo: item.price.toFixed(2).replace(".", ","),
          Note: item.note,
          "In Promo": item.inPromo ? "Si" : "No",
          Data: item.date.split(", ")[0],
          Ora: item.date.split(", ")[1],
          Foto1: item.photos[0] ?? "",
          Foto2: item.photos[1] ?? "",
          Foto3: item.photos[2] ?? "",
          L1: "",
          L2: "",
          L3: "",
          L4: "",
          L5: "",
          L6: "000000",
          L7: "",
          L8: "",
        };
      });

      // Genera il CSV
      const csv = Papa.unparse(transformedData, {
        delimiter: ";",
      });

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
        cc: this.configService.get<string>("MAIL_CC"),
        subject: `Articoli rilevati da ${data[0].userCode} il ${data[0].date.split(",")[0]}`,
        text: "In allegato trovi il report in formato CSV.",
        attachments: [
          {
            filename: "report.csv",
            content: csv,
          },
        ],
      };

      return await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error("Failed to send email");
        }
      });
    } catch (error) {
      throw error; // Rilancia l'errore per gestirlo in altri livelli
    }
  }

  async askChatGPT(data: GptDto): Promise<string> {
    try {
      console.log("Invio richiesta a OpenAI:", JSON.stringify(data, null, 2)); // Debug

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        {
          headers: {
            Authorization: `Bearer ${this.apiKeyGPT}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        "Errore API OpenAI:",
        error.response?.data || error.message
      );
      throw new Error("Errore durante la comunicazione con OpenAI");
    }
  }
}
