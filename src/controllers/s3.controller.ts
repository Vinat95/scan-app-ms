import {
  BadRequestException,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth.guard";
import { S3Service } from "src/services/s3.service";

@Controller("aws")
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "File to upload",
    type: "multipart/form-data",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File successfully uploaded",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        url: { type: "string" },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    let result;
    if (file) {
      if (file.mimetype !== "image/jpeg") {
        throw new BadRequestException("Solo i file JPEG sono consentiti");
      }
      if (file.size > 100 * 1024) {
        throw new BadRequestException("Il file supera i 100Kb");
      }
      // Caricamento del file su S3
      try {
        result = await this.s3Service.uploadImage(file);
      } catch (error) {
        // Gestione dell'errore di caricamento
        throw new BadRequestException("Errore durante il caricamento del file");
      }
    }

    return {
      message: "File uploaded successfully",
      url: result ? result.Location : "", // URL dell'immagine caricata
    };
  }

  @Delete("images/:key")
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param("key") key: string) {
    try {
      const result = await this.s3Service.deleteImageFromS3(key);
      return {
        message: "File deleted successfully",
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Si è verificato un errore durante l'eliminazione del file."
      );
    }
  }
}
