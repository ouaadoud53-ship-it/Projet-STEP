import { Injectable } from '@nestjs/common';
import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}
