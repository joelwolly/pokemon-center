import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePokemonDto {

    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsNumber()
    level: number; 

    @IsNumber()
    hp: number; 

    @IsNumber()
    pokedexNumber: number; 

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}