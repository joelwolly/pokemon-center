import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(userData: any): Promise<User> {
        const { email, password, name } = userData;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.userRepository.create({
            email,
            name,
            password: hashedPassword,
        });

        return this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id', 'email', 'name'],
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            select: ['id', 'email', 'name'],
        });
    }

    async update(id: number, updateData: any): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return null;

        if (updateData.password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        await this.userRepository.update(id, updateData);
        return this.findById(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }

}