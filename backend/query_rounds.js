const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rounds = await prisma.interviewRound.findMany({
    where: { applicationId: '699ea3c3-aa94-43c9-bb24-dea01d1323d0' },
    orderBy: { scheduledAt: 'asc' }
  });
  console.log(JSON.stringify(rounds, null, 2));
}
main().finally(() => prisma.$disconnect());
