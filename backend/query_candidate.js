const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { id: 'b0ec5e45-6860-44c5-b4cc-9d46ce77d913' } });
  console.log(user);
}
main().finally(() => prisma.$disconnect());
