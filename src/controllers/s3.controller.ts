import {
  BadRequestException,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth.guard";
import { S3Service } from "src/services/s3.service";

@Controller("aws")
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("upload")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "files", maxCount: 3 }, // Massimo 3 file
    ])
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "File to upload",
    type: "multipart/form-data",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Files successfully uploaded",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        urls: { type: "array", items: { type: "string" } },
      },
    },
  })
  async uploadFile(@UploadedFiles() files: { files?: Express.Multer.File[] }) {
    let result;
    if (files?.files && files.files.length > 0) {
      if (files.files.some((file) => file.mimetype !== "image/jpeg")) {
        throw new BadRequestException("Solo i file JPEG sono consentiti");
      }
      if (files.files.some((file) => file.size > 100 * 1024)) {
        throw new BadRequestException("Il file supera i 100Kb");
      }
      // Caricamento del file su S3
      try {
        result = await this.s3Service.uploadImages(files.files);
      } catch (error) {
        // Gestione dell'errore di caricamento
        throw new BadRequestException("Errore durante il caricamento del file");
      }
    }

    return {
      message: "Files uploaded successfully",
      urls: result ? result.map((item) => item.Location) : [], // URL dell'immagine caricata
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
