'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addReview } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SubmitReviewSchema } from '@/lib/validationSchemas';
import { courseData } from '@/lib/courseData';
import styles from './SubmitReviewForm.module.css';

const tagOptions = [
  'Homework heavy',
  'Lecture heavy',
  'Exam heavy',
  'Group projects',
  'Challenging',
  'Easy grading',
];

const tagColors = [
  '#e8f5f0', // light green
  '#f0f8ff', // light blue
  '#fff8e1', // light yellow
  '#ffebee', // light red
  '#f3e5f5', // light purple
  '#fce4ec', // light pink
];

const semesterOptions = [
  'Fall 2023',
  'Spring 2024',
  'Summer 2024',
  'Fall 2024',
  'Spring 2025',
  'Summer 2025',
  'Fall 2025',
  'Spring 2026',
];

const StarRating: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => {
  const handleClick = (index: number, half: boolean) => {
    const newValue = index + (half ? 0.5 : 1);
    onChange(newValue);
  };

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => {
        const isFull = value >= i + 1;
        const isHalf = value >= i + 0.5 && value < i + 1;
        return (
          <div key={i} style={{ position: 'relative', cursor: 'pointer' }}>
            <span
              style={{ fontSize: '24px', color: '#ddd' }}
              onClick={() => handleClick(i, false)}
            >
              ★
            </span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                overflow: 'hidden',
                fontSize: '24px',
                color: '#ffc107',
              }}
              onClick={() => handleClick(i, true)}
            >
              {isHalf || isFull ? '★' : ''}
            </span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: '24px',
                color: isFull ? '#ffc107' : isHalf ? '#ffc107' : '#ddd',
              }}
              onClick={() => handleClick(i, false)}
            >
              ★
            </span>
          </div>
        );
      })}
    </div>
  );
};

const SubmitReviewForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const [professors, setProfessors] = useState<string[]>(courseData[0]?.professors ?? []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SubmitReviewSchema),
    defaultValues: { anonymous: false, authorEmail: currentUser },
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);

  type ReviewFormData = {
    courseCode: string;
    professor: string;
    text: string;
    anonymous: boolean;
    authorEmail?: string | null;
    semesterTaken?: string | null;
  };

  const onSubmit = async (data: ReviewFormData, selectedTags: string[]) => {
    await addReview({
      courseCode: data.courseCode,
      professor: data.professor,
      rating: rating,
      text: data.text,
      anonymous: Boolean(data.anonymous),
      authorEmail: data.anonymous ? null : data.authorEmail,
      tags: selectedTags,
      semesterTaken: data.semesterTaken || null,
    });
    swal('Success', 'Your review has been submitted', 'success', {
      timer: 2000,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <Container className="py-3">
          <Row className="justify-content-center">
            <Col xs={8}>
              <Col className="text-center">
                <h2 className={styles.formTitle}>Submit Review</h2>
              </Col>
              <Card className={styles.formCard}>
                <Card.Body className={styles.cardBody}>
                  <Form onSubmit={handleSubmit((d) => onSubmit(d, selectedTags))}>
                <Form.Group>
                  <Form.Label>Course</Form.Label>
                  <select
                    {...register('courseCode')}
                    className={`form-select ${errors.courseCode ? 'is-invalid' : ''}`}
                    onChange={(e) => {
                      const code = e.target.value;
                      const found = courseData.find((c) => c.code === code);
                      setProfessors(found?.professors ?? []);
                    }}
                  >
                    {courseData.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.courseCode?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Professor</Form.Label>
                  <select {...register('professor')} className={`form-select ${errors.professor ? 'is-invalid' : ''}`}>
                    {professors.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.professor?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Semester Taken</Form.Label>
                  <select {...register('semesterTaken')} className="form-select">
                    <option value="">Select a semester (optional)</option>
                    {semesterOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <StarRating value={rating} onChange={setRating} />
                  <div className="invalid-feedback">{errors.rating?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Review</Form.Label>
                  <textarea {...register('text')} className={`form-control ${errors.text ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.text?.message}</div>
                </Form.Group>

                <Form.Group className="pt-2">
                  <Form.Check
                    type="switch"
                    id="post-anon-switch"
                    label="Post anonymously"
                    {...register('anonymous')}
                  />
                </Form.Group>

                <Form.Group className="pt-2">
                  <Form.Label>Tags</Form.Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {tagOptions.map((t, index) => {
                      const selected = selectedTags.includes(t);
                      const color = tagColors[index % tagColors.length];
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 16,
                            border: selected ? '1px solid #0b6b61' : `1px solid ${color}`,
                            background: selected ? '#20a084' : color,
                            color: selected ? 'white' : '#333',
                            cursor: 'pointer',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </Form.Group>

                <input type="hidden" {...register('authorEmail')} value={currentUser} />

                <Form.Group className="form-group">
                  <Row className="pt-3 justify-content-center">
                    <Col xs="auto">
                      <Button type="submit" variant="success" className={`${styles.submitButton} me-3`}>
                        Submit
                      </Button>
                      <Button type="button" onClick={() => { reset(); setSelectedTags([]); setRating(0); }} variant="outline-secondary">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
      </div>
    </div>
  );
};

export default SubmitReviewForm;

