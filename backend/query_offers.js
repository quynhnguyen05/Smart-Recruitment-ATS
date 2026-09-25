const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const offers = await prisma.offer.findMany({});
  console.log(JSON.stringify(offers, null, 2));
}
main().finally(() => prisma.$disconnect());
