import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prisma } from '../lib/prisma';

type ParsedRow = {
  courseCode: string;
  courseName: string;
  instructor: string;
};

const toMathCode = (rawCourseNumber: string): string => {
  const trimmed = rawCourseNumber.trim();
  if (!trimmed) {
    throw new Error('Missing course number');
  }

  const normalized = trimmed.replace(/\s+/g, ' ').toUpperCase();

  if (normalized.startsWith('MATH ')) {
    return normalized;
  }

  const compact = normalized.replace(/\s+/g, '');
  const codeMatch = compact.match(/^(\d{3}[A-Z]?)$/);
  if (!codeMatch) {
    throw new Error(`Invalid course number: ${rawCourseNumber}`);
  }

  return `MATH ${codeMatch[1]}`;
};

const parseCsvLine = (line: string): string[] => {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  fields.push(current.trim());
  return fields;
};

const parseRows = (csvText: string): ParsedRow[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const header = parseCsvLine(lines[0]).map((column) => column.toLowerCase());
  const courseNumberIndex = header.findIndex((column) => ['coursenumber', 'course_number', 'course number', 'number'].includes(column));
  const courseNameIndex = header.findIndex((column) => ['coursename', 'course_name', 'course name', 'name', 'title'].includes(column));
  const instructorIndex = header.findIndex((column) => ['instructor', 'professor', 'teacher'].includes(column));

  if (courseNumberIndex === -1 || courseNameIndex === -1 || instructorIndex === -1) {
    throw new Error('CSV header must include course number, course name, and instructor columns.');
  }

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const courseCode = toMathCode(cols[courseNumberIndex] ?? '');
    const courseName = (cols[courseNameIndex] ?? '').trim();
    const instructor = (cols[instructorIndex] ?? '').trim();

    if (!courseName || !instructor) {
      throw new Error(`Invalid row: ${line}`);
    }

    return { courseCode, courseName, instructor };
  });
};

const importMathCourses = async () => {
  const importPath = process.argv[2] || 'data/math-courses.csv';
  const absolutePath = resolve(process.cwd(), importPath);
  const csvText = readFileSync(absolutePath, 'utf8');
  const rows = parseRows(csvText);

  const courses = new Map<string, { name: string; professors: Set<string> }>();

  rows.forEach((row) => {
    const existing = courses.get(row.courseCode);
    if (!existing) {
      courses.set(row.courseCode, {
        name: row.courseName,
        professors: new Set([row.instructor]),
      });
      return;
    }

    existing.name = row.courseName;
    existing.professors.add(row.instructor);
  });

  for (const [classId, data] of courses.entries()) {
    const course = await prisma.course.upsert({
      where: { classId },
      update: { name: data.name },
      create: { classId, name: data.name },
    });

    for (const professorName of data.professors) {
      await prisma.professor.upsert({
        where: {
          courseId_name: {
            courseId: course.id,
            name: professorName,
          },
        },
        update: {},
        create: {
          courseId: course.id,
          name: professorName,
        },
      });
    }
  }

  console.log(`Imported ${courses.size} MATH courses from ${absolutePath}`);
};

importMathCourses()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
