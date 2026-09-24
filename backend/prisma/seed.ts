import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@123', 10);

  const users = [
    { email: 'admin@ats.demo', passwordHash, role: 'ADMIN' as const },
    { email: 'recruiter@ats.demo', passwordHash, role: 'RECRUITER' as const },
    { email: 'hm@ats.demo', passwordHash, role: 'HIRING_MANAGER' as const },
    { email: 'interviewer@ats.demo', passwordHash, role: 'INTERVIEWER' as const },
    { email: 'candidate@ats.demo', passwordHash, role: 'CANDIDATE' as const },
    { email: 'minh.anh.cv01@ats.demo', passwordHash, role: 'CANDIDATE' as const },
  ];

  await prisma.user.createMany({ data: users, skipDuplicates: true });

  const recruiter = await prisma.user.findUniqueOrThrow({ where: { email: 'recruiter@ats.demo' } });
  const candidate = await prisma.user.findUniqueOrThrow({ where: { email: 'minh.anh.cv01@ats.demo' } });

  const job = await prisma.jobPosting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {
      title: 'Backend Developer',
      description: 'Xay dung va van hanh dich vu backend cho he thong tuyen dung.',
      requirements: 'Java, Spring Boot, REST API, PostgreSQL, Redis, Docker, Git, Microservices',
      status: 'PUBLISHED',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      title: 'Backend Developer',
      description: 'Xay dung va van hanh dich vu backend cho he thong tuyen dung.',
      requirements: 'Java, Spring Boot, REST API, PostgreSQL, Redis, Docker, Git, Microservices',
      status: 'PUBLISHED',
      createdBy: recruiter.id,
    },
  });

  await prisma.application.upsert({
    where: { one_application_per_job_per_candidate: { jobId: job.id, candidateId: candidate.id } },
    update: { cvUrl: 'cv-01-backend-developer.txt', status: 'NEW' },
    create: {
      jobId: job.id,
      candidateId: candidate.id,
      cvUrl: 'cv-01-backend-developer.txt',
      status: 'NEW',
    },
  });

  console.log('Seed thanh cong: user demo, job Backend Developer va CV-01 da san sang.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());