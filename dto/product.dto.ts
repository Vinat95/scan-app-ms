import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class Product {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  shopName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  userCode: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  ean: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  note: string;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  inPromo: boolean;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  date: string;
}
