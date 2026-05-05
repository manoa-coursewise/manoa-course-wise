'use client';

import { useEffect, useState } from 'react';
import { getAllProfessors } from '@/lib/dbActions';

interface Professor {
  id: number;
  name: string;
  courseId: number;
  course: {
    id: number;
    classId: string;
    name: string;
  };
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const data = await getAllProfessors();
        setProfessors(data);
      } catch (err) {
        setError('Failed to load professors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Professors</h1>
        <p>Loading professors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Professors</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Professors Associated with Courses</h1>
      {professors.length === 0 ? (
        <p>No professors found in the database.</p>
      ) : (
        <div>
          <p>Total professors: {professors.length}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                  Professor Name
                </th>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                  Course Code
                </th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((prof) => (
                <tr key={prof.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>{prof.name}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>{prof.course.classId}</td>
                  <td style={{ padding: '10px' }}>{prof.course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
