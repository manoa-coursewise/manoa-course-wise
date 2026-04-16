const CourseCard = ({ course }) => {
 return (
    <div className="card shadow-sm p-3 h-100">
      <div className="d-flex justify-content-between">
        <div>
          <h6 className="text-success fw-bold">{course.code}</h6>
          <h5>{course.title}</h5>
          <p className="text-muted">{course.professor}</p>
        </div>

        <div className="text-end">
          <h2 className="text-success">{course.rating}</h2>
          <small>{course.reviews} reviews</small>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3 text-center">
        <div>
          <small>Difficulty</small>
          <div>{course.difficulty}</div>
        </div>
        <div>
          <small>Workload</small>
          <div>{course.workload}</div>
        </div>
        <div>
          <small>Clarity</small>
          <div className="text-success">{course.clarity}</div>
        </div>
      </div>

      <div className="mt-3">
        {course.tags.map((tag, idx) => (
          <span
            key={idx}
            className="badge bg-light text-dark me-2 mb-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CourseCard;