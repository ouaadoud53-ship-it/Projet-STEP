import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    user = await prisma.user.create({
      data: {
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@system.com',
        passwordHash,
      },
    });
    console.log('Created default user:', user.email);
  }

  const result = await prisma.marche.updateMany({
    where: { userId: null },
    data: { userId: user.id },
  });
  console.log(`Assigned ${result.count} existing marches to default user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
