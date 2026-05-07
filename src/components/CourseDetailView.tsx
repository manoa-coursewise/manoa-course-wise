'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from 'react-bootstrap';
import type { Prisma } from '@prisma/client';

type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    professors: {
      orderBy: { name: 'asc' };
    };
    reviews: {
      include: {
        professor: true;
      };
      orderBy: {
        createdAt: 'desc';
      };
    };
  };
}>;

const toFixed = (value: number) => Number(value.toFixed(1));

const CourseDetailView = ({ course }: { course: CourseWithDetails }) => {
  const reviewCount = course.reviews.length;
  const total = course.reviews.reduce(
    (acc, review) => {
      acc.rating += review.rating;
      acc.difficulty += review.difficulty;
      acc.workload += review.workload;
      acc.clarity += review.clarity;
      return acc;
    },
    { rating: 0, difficulty: 0, workload: 0, clarity: 0 },
  );

  const avgRating = reviewCount ? toFixed(total.rating / reviewCount) : 0;
  const avgDifficulty = reviewCount ? toFixed(total.difficulty / reviewCount) : 0;
  const avgWorkload = reviewCount ? toFixed(total.workload / reviewCount) : 0;
  const avgClarity = reviewCount ? toFixed(total.clarity / reviewCount) : 0;

  const tagCounts = new Map<string, number>();
  course.reviews.forEach((review) => {
    review.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentCourseId = course.classId;
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const loadSavedCourseState = async () => {
      try {
        const response = await fetch('/api/saved-courses', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const saved = Array.isArray(data.savedCourses)
          ? data.savedCourses.some((item: { classId: string }) => item.classId === currentCourseId)
          : false;
        setIsSaved(saved);
      } catch (error) {
        console.error('Failed to load saved course state:', error);
      }
    };

    loadSavedCourseState();
  }, [status, currentCourseId]);

  const handleSaveCourse = async () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    setSaveError(null);
    setSaving(true);

    try {
      const response = await fetch('/api/saved-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId: currentCourseId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Failed to save course');
      }

      setIsSaved(true);
    } catch (error) {
      setSaveError((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="course-details-page">
      <div className="container mt-4">
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="text-success fw-bold">{course.classId}</h3>
              <h1 className="fw-bold">{course.name}</h1>
              <p className="text-muted">{course.professors.map((p) => p.name).join(', ') || 'TBA'}</p>
            </div>

            <div className="text-end">
              <h1 className="text-success">{avgRating || '--'}</h1>
              <p className="text-muted">{reviewCount} reviews</p>
            </div>
          </div>

          <div className="row mt-4 text-center">
            <div className="col">
              <small>Difficulty</small>
              <h4>{avgDifficulty || '--'}</h4>
            </div>
            <div className="col">
              <small>Workload</small>
              <h4>{avgWorkload || '--'}</h4>
            </div>
            <div className="col">
              <small>Clarity</small>
              <h4 className="text-success">{avgClarity || '--'}</h4>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="course-section-title">Common Student Feedback</h5>
          <div className="mt-2">
            {topTags.length === 0 && <p className="course-section-muted mb-0">No tags yet.</p>}
            {topTags.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="badge bg-light text-dark me-2 mb-2 p-2">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="course-section-title">Student Reviews</h4>
              <div className="d-flex gap-2">
                <Button className="btn btn-success border" href="/reviews/submit">Write a Review</Button>
                <Button
                  className="btn btn-success border"
                  onClick={handleSaveCourse}
                  disabled={saving || isSaved}
                >
                  {isSaved ? 'Saved' : saving ? 'Saving...' : 'Save Course'}
                </Button>
              </div>
            </div>
            {saveError && <p className="text-danger">{saveError}</p>}

            {course.reviews.length === 0 && (
              <div className="card p-3 mb-3 shadow-sm">
                <p className="mb-0 text-muted">No reviews yet. Be the first to submit one.</p>
              </div>
            )}

            {course.reviews.map((review) => (
              <div key={review.id} className="card p-3 mb-3 shadow-sm">
                <div className="d-flex justify-content-between">
                  <strong>
                    {(review.semesterTaken ?? 'Semester N/A')} • {review.professor?.name ?? 'Professor N/A'} • {review.anonymous ? 'Anonymous' : (review.authorEmail ?? 'User')}
                  </strong>
                  <span className="text-success">{review.rating}</span>
                </div>

                <p className="mt-2">{review.text}</p>

                <small className="text-muted">
                  Difficulty: {review.difficulty} | Workload: {review.workload} | Clarity: {review.clarity}
                </small>

                {review.tags.length > 0 && (
                  <div className="mt-2">
                    {review.tags.map((tag) => (
                      <span key={`${review.id}-${tag}`} className="badge bg-light text-dark me-2 mb-1 p-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailView;