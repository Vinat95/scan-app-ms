import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";

export class Messages {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  role: string = "user";

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}

export class GptDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  model: string = "gpt-3.5-turbo";

  @ApiProperty({ type: [Messages], description: "Messaggi" })
  @IsArray()
  @ValidateNested({ each: true }) // Assicura che ogni elemento nell'array sia validato come un Product
  @Type(() => Messages) // Applica la trasformazione per ogni elemento dell'array
  messages: Messages[];
}
