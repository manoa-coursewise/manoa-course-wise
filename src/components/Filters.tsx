const Filters = ({
  selectedDepartments,
  setSelectedDepartments,
}: {
  selectedDepartments: string[];
  setSelectedDepartments: (departments: string[]) => void;
}) => {

  const departments = ["ICS", "MATH", "BIOL", "ECON"];
  
  const handleChange = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(
        selectedDepartments.filter((d) => d !== dept)
      );
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  const handleReset = () => {
    setSelectedDepartments(departments); // select all
  };

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between">
        <h5>Filters</h5>
        <small
          className="text-success"
          style={{ cursor: "pointer" }}
          onClick={handleReset}
        >
          Reset All
        </small>
      </div>

      <hr />

      <h6>Department</h6>

      {departments.map((dept) => (
        <div className="form-check" key={dept}>
          <input
            className="form-check-input"
            type="checkbox"
            checked={selectedDepartments.includes(dept)}
            onChange={() => handleChange(dept)}
          />
          <label className="form-check-label">{dept}</label>
        </div>
      ))}

      <button className="btn btn-success w-100 mt-3">
        Apply Filters
      </button>
    </div>
  );
}

export default Filters;