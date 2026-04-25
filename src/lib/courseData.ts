export type CourseSeed = {
  code: string;
  name: string;
  professors: string[];
};

export const courseData: CourseSeed[] = [
  { code: 'ICS 311', name: 'Algorithms', professors: ['Kyle Berney'] },
  { code: 'MATH 242', name: 'Calculus II', professors: ['Dr. Susan Park', 'Dr. Michael Yang'] },
  { code: 'ECON 300', name: 'Intermediate Microeconomics', professors: ['Dr. Karen Wong', 'Dr. David Chan'] },
  { code: 'BIOL 172', name: 'Introduction to Biology', professors: ['Dr. Emily Cruz', 'Dr. Robert Hale'] },
];
