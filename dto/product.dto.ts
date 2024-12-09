import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from "class-validator";

export class Product {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50) // Lunghezza minima e massima del nome negozio
  shopName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20) // Lunghezza minima e massima del codice utente
  userCode: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(13, 13) // Lunghezza esatta dell'EAN
  ean: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0) // Prezzo deve essere maggiore o uguale a 0
  price: number;

  @ApiProperty()
  @IsOptional() // Note possono essere opzionali
  @IsString()
  @Length(0, 255) // Lunghezza massima per le note
  note?: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  inPromo: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  date: string;
}
