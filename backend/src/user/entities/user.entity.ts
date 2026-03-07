
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
@PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.owner)
  pokemons: Pokemon[];
}