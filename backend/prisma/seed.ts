import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@123', 10);

  await prisma.user.createMany({
    data: [
      { email: 'admin@ats.demo', passwordHash, role: 'ADMIN' },
      { email: 'recruiter@ats.demo', passwordHash, role: 'RECRUITER' },
      { email: 'hm@ats.demo', passwordHash, role: 'HIRING_MANAGER' },
      { email: 'interviewer@ats.demo', passwordHash, role: 'INTERVIEWER' },
      { email: 'candidate@ats.demo', passwordHash, role: 'CANDIDATE' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed thành công: 5 user demo đã được tạo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());