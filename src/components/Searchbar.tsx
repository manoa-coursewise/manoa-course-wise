"use client";

import { FormEvent, useState, useEffect } from "react";

interface SearchbarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const Searchbar = ({ onSearch, initialQuery = "" }: SearchbarProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch(value.trim());
  };

  return (
    <form className="course-searchbar mb-4" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Search by course code, title, professor, or tags"
          value={query}
          onChange={(event) => handleInputChange(event.target.value)}
          aria-label="Search courses"
        />
        <button type="submit" className="btn btn-success">
          Search
        </button>
      </div>
    </form>
  );
};

export default Searchbar;