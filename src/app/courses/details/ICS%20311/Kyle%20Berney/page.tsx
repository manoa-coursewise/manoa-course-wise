import '../../details.css';
import { Button } from 'react-bootstrap';

const course = {
  code: "ICS 311",
  title: "Algorithms",
  professor: "Kyle Berney",
  rating: 4.7,
  reviews: 218,
  difficulty: 4.1,
  workload: 3.9,
  clarity: 4.8,
  wouldTakeAgain: 94,
  tags: [
    "Heavy Reading",
    "Strong Lectures",
    "Tough Exams",
    "Proof Heavy",
    "Clear Explanations",
  ],
};

const reviews = [
  {
    term: "Spring 2025",
    rating: 5.0,
    text: `"Best class I've taken at Manoa. Kyle explains complex topics very clearly. Exams are tough but fair and directly based on lectures. Highly recommended."`,
    difficulty: 4,
    workload: 4,
    clarity: 5,
  },
  {
    term: "Fall 2024",
    rating: 4.5,
    text: `"Challenging but rewarding. Lots of reading."`,
    difficulty: 4,
    workload: 4,
    clarity: 4,
  },
];

const CourseDetail = () => {
  return (
    <div className="course-details-page">

      <div className="container mt-4">
        {/* Top Card */}
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="text-success fw-bold">{course.code}</h3>
              <h1 className="fw-bold">{course.title}</h1>
              <p className="text-muted">{course.professor}</p>
            </div>

            <div className="text-end">
              <h1 className="text-success">{course.rating}</h1>
              <p className="text-muted">{course.reviews} reviews</p>
            </div>
          </div>

          <div className="row mt-4 text-center">
            <div className="col">
              <small>Difficulty</small>
              <h4>{course.difficulty}</h4>
            </div>
            <div className="col">
              <small>Workload</small>
              <h4>{course.workload}</h4>
            </div>
            <div className="col">
              <small>Clarity</small>
              <h4 className="text-success">{course.clarity}</h4>
            </div>
            <div className="col">
              <small>Would Take Again</small>
              <h4 className="text-success">{course.wouldTakeAgain}%</h4>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h5>Common Student Feedback</h5>
          <div className="mt-2">
            {course.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-light text-dark me-2 mb-2 p-2">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Reviews */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Student Reviews</h4>
              <Button className="btn btn-success border" href="/reviews/submit">Write a Review</Button>
            </div>

            {reviews.map((review, idx) => (
              <div key={idx} className="card p-3 mb-3 shadow-sm">
                <div className="d-flex justify-content-between">
                  <strong>
                    {review.term} • Anonymous
                  </strong>
                  <span className="text-success">{review.rating}</span>
                </div>

                <p className="mt-2">{review.text}</p>

                <small className="text-muted">
                  Difficulty: {review.difficulty} | Workload:{" "}
                  {review.workload} | Clarity: {review.clarity}
                </small>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Course Schedule</h5>

              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Typical Time</span>
                  <span>MWF 10:30 AM - 11:20 AM</span>
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Best Semester</span>
                  <span className="text-success">Fall</span>
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted">Credits</span>
                  <span>3</span>
                </div>
              </div>

              <hr />

              <h6>Add to Schedule</h6>
              <button className="btn btn-success w-100 mt-2">
                Add to My Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;