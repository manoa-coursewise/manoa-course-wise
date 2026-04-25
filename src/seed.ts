import { prisma } from './lib/prisma';
import { Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import { courseData } from './lib/courseData';

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
     
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }

  for (const course of courseData) {
    const createdCourse = await prisma.course.upsert({
      where: { classId: course.code },
      update: {
        name: course.name,
      },
      create: {
        classId: course.code,
        name: course.name,
      },
    });

    for (const professor of course.professors) {
      await prisma.professor.upsert({
        where: {
          courseId_name: {
            courseId: createdCourse.id,
            name: professor,
          },
        },
        update: {},
        create: {
          courseId: createdCourse.id,
          name: professor,
        },
      });
    }
  }

  const ics311 = await prisma.course.findUnique({
    where: { classId: 'ICS 311' },
    include: { professors: true },
  });

  if (ics311) {
    const kyle = ics311.professors.find((p) => p.name === 'Kyle Berney')
      ?? await prisma.professor.upsert({
        where: {
          courseId_name: {
            courseId: ics311.id,
            name: 'Kyle Berney',
          },
        },
        update: {},
        create: {
          name: 'Kyle Berney',
          courseId: ics311.id,
        },
      });

    const existingIcsReviews = await prisma.review.count({
      where: { courseId: ics311.id },
    });

    if (existingIcsReviews === 0) {
      const author = await prisma.user.findFirst({ select: { id: true, email: true } });

      await prisma.review.createMany({
        data: [
          {
            courseId: ics311.id,
            professorId: kyle.id,
            userId: author?.id ?? null,
            authorEmail: author?.email ?? null,
            semesterTaken: 'Spring 2025',
            text: 'Clear explanations and fair exams. Assignments are challenging but manageable with consistent effort.',
            difficulty: 4,
            workload: 4,
            clarity: 5,
            rating: 4.33,
            anonymous: false,
            tags: ['Homework heavy', 'Exam heavy', 'Challenging'],
          },
          {
            courseId: ics311.id,
            professorId: kyle.id,
            userId: null,
            authorEmail: null,
            semesterTaken: 'Fall 2024',
            text: 'Great lectures and very structured notes. Weekly work is steady and group discussions help a lot.',
            difficulty: 3,
            workload: 4,
            clarity: 5,
            rating: 4,
            anonymous: true,
            tags: ['Lecture heavy', 'Group projects'],
          },
        ],
      });
    }
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
