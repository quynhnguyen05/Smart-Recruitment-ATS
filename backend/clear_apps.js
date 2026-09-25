const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.application.deleteMany({ where: { candidateId: 'e3491e82-85c1-4eec-b446-b262c51ba4e0' } });
}
main().finally(() => prisma.$disconnect());
