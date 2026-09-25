const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.jobPosting.findMany({ select: { id: true, title: true } });
  console.log("JOBS:");
  console.log(JSON.stringify(jobs, null, 2));

  const apps = await prisma.application.findMany({
    include: {
      job: { select: { title: true } }
    }
  });
  
  const candidates = await prisma.user.findMany({ select: { id: true, email: true } });
  
  const formattedApps = apps.map(app => ({
    id: app.id,
    candidateEmail: candidates.find(c => c.id === app.candidateId)?.email,
    jobTitle: app.job.title,
    status: app.status
  }));

  console.log("APPLICATIONS:");
  console.log(JSON.stringify(formattedApps, null, 2));
}

main().finally(() => prisma.$disconnect());
