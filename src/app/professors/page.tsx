'use client';

import { useEffect, useState } from 'react';
import styles from '@/components/SubmitReviewForm.module.css';

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
        const res = await fetch('/api/professors');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
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
      <div className={styles.heroSection}>
        <div className="container py-4">
          <div className="card shadow-sm p-4 mb-4">
            <h2 className="mb-4">Professors</h2>
            <p>Loading professors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.heroSection}>
        <div className="container py-4">
          <div className="card shadow-sm p-4 mb-4">
            <h2 className="mb-4">Professors</h2>
            <p className="text-danger">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.heroSection}>
      <div className="container py-4">
        <div className="card shadow-sm p-4 mb-4">
          <h2 className="mb-4">Professors Associated with Courses</h2>
          {professors.length === 0 ? (
            <p className="text-muted">No professors found in the database.</p>
          ) : (
            <>
              <p className="mb-3">Total professors: {professors.length}</p>
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Professor Name</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professors.map((prof) => (
                      <tr key={prof.id}>
                        <td>{prof.name}</td>
                        <td>{prof.course?.classId ?? ''}</td>
                        <td>{prof.course?.name ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
