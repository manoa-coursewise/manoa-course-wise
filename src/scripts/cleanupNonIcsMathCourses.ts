import { prisma } from '../lib/prisma';

const run = async () => {
  const before = await prisma.course.findMany({
    where: {
      NOT: [
        { classId: { startsWith: 'ICS ' } },
        { classId: { startsWith: 'MATH ' } },
      ],
    },
    select: { classId: true, name: true },
    orderBy: { classId: 'asc' },
  });

  const deleted = await prisma.course.deleteMany({
    where: {
      NOT: [
        { classId: { startsWith: 'ICS ' } },
        { classId: { startsWith: 'MATH ' } },
      ],
    },
  });

  const total = await prisma.course.count();
  const ics = await prisma.course.count({ where: { classId: { startsWith: 'ICS ' } } });
  const math = await prisma.course.count({ where: { classId: { startsWith: 'MATH ' } } });

  console.log(
    JSON.stringify(
      {
        removedCourses: before,
        deletedCount: deleted.count,
        counts: { total, ics, math },
      },
      null,
      2,
    ),
  );
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
