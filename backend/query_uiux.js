const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rounds = await prisma.interviewRound.findMany({
    where: { applicationId: '7d4f1809-0160-465b-91d4-f42907463190' },
    orderBy: { scheduledAt: 'asc' }
  });
  console.log(JSON.stringify(rounds, null, 2));
}
main().finally(() => prisma.$disconnect());
