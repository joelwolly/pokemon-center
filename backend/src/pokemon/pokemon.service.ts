import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  [x: string]: any;
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto, userId: number) {
    const pokemon = this.pokemonRepository.create({
      ...createPokemonDto,
      owner: { id: userId },
    });
    return await this.pokemonRepository.save(pokemon);
  }

  async findAll() {
    return await this.pokemonRepository.find({ relations: ['owner'] });
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto, userId: number) {
    const pokemon = await this.pokemonRepository.findOne({ 
      where: { id }, 
      relations: ['owner'] 
    });

    if (!pokemon) throw new NotFoundException('Pokémon não encontrado');

    if (pokemon.owner.id !== userId) {
      throw new UnauthorizedException('Você não tem permissão para editar este Pokémon');
    }

    Object.assign(pokemon, updatePokemonDto);
    return await this.pokemonRepository.save(pokemon);
  }

  async remove(id: number, userId: number) {
    const pokemon = await this.pokemonRepository.findOne({ 
      where: { id }, 
      relations: ['owner'] 
    });

    if (!pokemon) throw new NotFoundException('Pokémon não encontrado');
    if (pokemon.owner.id !== userId) {
      throw new UnauthorizedException('Você não tem permissão para remover este Pokémon');
    }

    return await this.pokemonRepository.remove(pokemon);
  }
}