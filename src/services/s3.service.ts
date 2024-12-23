import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service {
  private readonly awsAccessKeyId: string;
  private readonly awsSecretAccessKey: string;
  private readonly awsRegion: string;
  private readonly awsBucketName: string;
  private s3;

  constructor(private configService: ConfigService) {
    this.awsAccessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    this.awsSecretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY"
    );
    this.awsRegion = this.configService.get<string>("AWS_REGION");
    this.awsBucketName = this.configService.get<string>("AWS_BUCKET_NAME");
    this.s3 = new AWS.S3({
      accessKeyId: this.awsAccessKeyId,
      secretAccessKey: this.awsSecretAccessKey,
      region: this.awsRegion,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    const key = `${uuid()}-${file.originalname}`; // Genera un nome univoco per il file

    const params = {
      Bucket: this.awsBucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const data = await this.s3.upload(params).promise();
    return data;
  }

  async deleteImageFromS3(key: string): Promise<any> {
    const params = {
      Bucket: this.awsBucketName,
      Key: key,
    };

    try {
      const data = await this.s3.deleteObject(params).promise();
      return data;
    } catch (error) {
      throw new Error(`Unable to delete file: ${error.message}`);
    }
  }
}
