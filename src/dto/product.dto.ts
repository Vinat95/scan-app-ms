import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class Product {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  shopName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(0, 255)
  location: string;

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

  @ApiProperty({ type: [String], description: "Lista di url delle foto" })
  @IsArray()
  @Type(() => String) // Applica la trasformazione per ogni elemento dell'array
  photos: String[];
}
export class Products {
  @ApiProperty({ type: [Product], description: "Lista di prodotti" })
  @IsArray()
  @ValidateNested({ each: true }) // Assicura che ogni elemento nell'array sia validato come un Product
  @Type(() => Product) // Applica la trasformazione per ogni elemento dell'array
  products: Product[];
}
