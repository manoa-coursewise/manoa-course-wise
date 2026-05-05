'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const [sortBy, setSortBy] = useState<'name' | 'courseCode'>('name');

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

  const sortedProfessors = [...professors].sort((a, b) => {
    if (sortBy === 'courseCode') {
      return a.course.classId.localeCompare(b.course.classId);
    }
    return a.name.localeCompare(b.name);
  });

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
          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort by:</label>
            <button
              onClick={() => setSortBy('name')}
              style={{
                padding: '8px 15px',
                marginRight: '10px',
                backgroundColor: sortBy === 'name' ? '#007bff' : '#f0f0f0',
                color: sortBy === 'name' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: sortBy === 'name' ? 'bold' : 'normal',
              }}
            >
              Alphabetically
            </button>
            <button
              onClick={() => setSortBy('courseCode')}
              style={{
                padding: '8px 15px',
                backgroundColor: sortBy === 'courseCode' ? '#007bff' : '#f0f0f0',
                color: sortBy === 'courseCode' ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: sortBy === 'courseCode' ? 'bold' : 'normal',
              }}
            >
              By Course Code
            </button>
          </div>
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
              {sortedProfessors.map((prof) => (
                <tr key={prof.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>{prof.name}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                    <Link
                      href={`/courses/details/${encodeURIComponent(prof.course.classId)}/${encodeURIComponent(prof.name)}`}
                      style={{ color: '#007bff', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {prof.course.classId}
                    </Link>
                  </td>
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
