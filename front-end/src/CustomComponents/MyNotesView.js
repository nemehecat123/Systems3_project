import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyNotesView = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Assuming you have an endpoint like '/api/notes/user/:userId'
        const response = await axios.get('/api/notes/user');
        setNotes(response.data.notes);
      } catch (err) {
        setError('Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Handling when data is being loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handling when there is an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>My Uploaded Notes</h2>
      <div className="row">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div className="col-md-4" key={note.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.description}</p>
                  <a href={`/notes/${note.id}`} className="btn btn-primary">
                    View Note
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No notes uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyNotesView;
