import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
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

  async findAll(userId: number) {
    return await this.pokemonRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  async findOne(id: number, userId: number) {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['owner'],
    });

    if (!pokemon) {
      throw new NotFoundException('Pokémon não encontrado ou acesso negado');
    }

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto, userId: number) {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!pokemon) {
      throw new NotFoundException('Pokémon não encontrado');
    }

    if (pokemon.owner.id !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar este Pokémon',
      );
    }

    if (updatePokemonDto.name !== undefined) {
      pokemon.name = updatePokemonDto.name;
    }

    if (updatePokemonDto.type !== undefined) {
      pokemon.type = updatePokemonDto.type;
    }

    if (updatePokemonDto.level !== undefined) {
      pokemon.level = updatePokemonDto.level;
    }

    if (updatePokemonDto.hp !== undefined) {
      pokemon.hp = updatePokemonDto.hp;
    }

    if (updatePokemonDto.color !== undefined) {
      pokemon.color = updatePokemonDto.color;
    }

    if (updatePokemonDto.imageUrl !== undefined) {
      pokemon.imageUrl = updatePokemonDto.imageUrl;
    }

    if (updatePokemonDto.ownerId) {
      pokemon.owner = { id: updatePokemonDto.ownerId } as any;
    }

    return await this.pokemonRepository.save(pokemon);
  }

  async remove(id: number, userId: number) {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!pokemon) {
      throw new NotFoundException('Pokémon não encontrado');
    }

    if (pokemon.owner.id !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover este Pokémon',
      );
    }

    return await this.pokemonRepository.remove(pokemon);
  }
}