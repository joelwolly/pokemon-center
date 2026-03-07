import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { User } from './user/entities/user.entity';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRoot({
    type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'centro_pokemon',
      entities: [User, Pokemon], 
      synchronize: true,
  }),
  AuthModule,
  UserModule,
  PokemonModule
],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
