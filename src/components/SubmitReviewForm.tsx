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

const tagOptions = [
  'Homework heavy',
  'Lecture heavy',
  'Exam heavy',
  'Group projects',
  'Challenging',
  'Easy grading',
];
const onSubmit = async (data: any) => {
  const selectedTags = data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [];
  await addReview({
    courseCode: data.courseCode,
    professor: data.professor,
    rating: Number(data.rating),
    text: data.text,
    anonymous: Boolean(data.anonymous),
    authorEmail: data.anonymous ? null : data.authorEmail,
    tags: selectedTags,
  });
  swal('Success', 'Your review has been submitted', 'success', {
    timer: 2000,
  });
};

const SubmitReviewForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const [professors, setProfessors] = useState<string[]>([]);

  useEffect(() => {
    // set default professors based on default course (if any)
    const defaultCourse = courseData[0]?.code;
    if (defaultCourse) {
      const found = courseData.find((c) => c.code === defaultCourse);
      setProfessors(found?.professors ?? []);
    }
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SubmitReviewSchema),
    defaultValues: { anonymous: false, authorEmail: currentUser },
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Col className="text-center">
            <h2>Submit Review</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Course</Form.Label>
                  <select
                    {...register('courseCode')}
                    className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`}
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
                  <select {...register('professor')} className={`form-control ${errors.professor ? 'is-invalid' : ''}`}>
                    {professors.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.professor?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <select {...register('rating')} className={`form-control ${errors.rating ? 'is-invalid' : ''}`}>
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                  <div className="invalid-feedback">{errors.rating?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Review</Form.Label>
                  <textarea {...register('text')} className={`form-control ${errors.text ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.text?.message}</div>
                </Form.Group>

                <Form.Group className="pt-2">
                  <Form.Check type="checkbox" label="Post anonymously" {...register('anonymous')} />
                </Form.Group>

                <Form.Group className="pt-3">
                  <Form.Label>Tags</Form.Label>
                  <div>
                    {tagOptions.map((t) => (
                      <Form.Check
                        key={t}
                        type="checkbox"
                        label={t}
                        value={t}
                        {...register('tags')}
                      />
                    ))}
                  </div>
                </Form.Group>

                <input type="hidden" {...register('authorEmail')} value={currentUser} />

                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
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
  );
};

export default SubmitReviewForm;
