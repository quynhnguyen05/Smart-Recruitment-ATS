const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rounds = await prisma.interviewRound.findMany({
    where: { applicationId: '2fca8fb2-5166-476a-bbac-48c7864616c9' },
    include: { scorecard: true }
  });
  console.log(JSON.stringify(rounds, null, 2));
}
main().finally(() => prisma.$disconnect());
