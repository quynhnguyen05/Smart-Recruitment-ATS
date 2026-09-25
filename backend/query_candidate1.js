const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'candidate1@ats.demo' } });
  if (!user) { console.log('user not found'); return; }
  const apps = await prisma.application.findMany({
    where: { candidateId: user.id },
    include: { job: true }
  });
  console.log(JSON.stringify(apps, null, 2));
}
main().finally(() => prisma.$disconnect());
