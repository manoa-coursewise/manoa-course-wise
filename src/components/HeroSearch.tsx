'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

const HeroSearch = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const destination = trimmedQuery
      ? `/courses/search?query=${encodeURIComponent(trimmedQuery)}`
      : '/courses/search';
    router.push(destination);
  };

  return (
    <div className="search-container mt-5">
      <Form className="search-form" onSubmit={handleSubmit}>
        <Form.Group className="search-group">
          <Form.Control
            type="text"
            placeholder="Search courses or professors... (e.g. ICS 311, MATH 242)"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search courses or professors"
          />
          <Button className="search-button" type="submit">
            <Search size={20} />
            Search
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default HeroSearch;
