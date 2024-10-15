import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";

const SingleNoteView = () => {
  const [note, setNote] = useState(null);  // State to store the note details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!note) {
    return <div>No note found.</div>;
  }

  return (
    <div className="container">
      <h2>{note.title}</h2>
      <p><strong>Description:</strong> {note.description}</p>
      <p><strong>Content:</strong> {note.content}</p>
      <p><strong>Created at:</strong> {note.created_at}</p>
      <p><strong>Last updated:</strong> {note.updated_at}</p>
    </div>
  );
};

export default SingleNoteView;