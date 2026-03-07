import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Pokemon {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  level: number;

  @Column()
  hp: number;

  @Column({ name: 'pokedex_number' })
  pokedexNumber: number;

  @ManyToOne(() => User, (user) => user.pokemons)
  owner: User;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  imageUrl: string;
}
