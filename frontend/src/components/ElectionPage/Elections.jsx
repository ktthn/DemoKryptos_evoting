import React, { useState, useEffect } from 'react';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2NzA5MDA3LCJpYXQiOjE3MTY3MDU0MDcsImp0aSI6IjgwMTVkZWE0ZDMyODQyYzdhNjc1ODIxOTVkNDg1ZTZjIiwidXNlcl9pZCI6MX0.vKKX4HJN_Gaxmhw2zV5Pap4ZKZ94nkaQ3C-tVc_Ut2M'; // Replace with your actual Bearer token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/elections/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setElections(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Elections</h1>
      <ul>
        {elections.map(election => (
          <li key={election.id}>
            <a href={`/elections/${election.id}`}>
              {election.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionList;
