import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class MyNotesView extends React.Component {


constructor(props) {
    super(props);
    this.state = {
      user_input: {
        username: "",
        password: ""
      },
      user: null,
      status: {
        success: null,
        msg: ""
      },
      notes:[],
    }
  }


  componentDidMount() {
    this.fetchNotes();
  }

  fetchNotes = async () => {
    try {
      const token = cookies.get('authToken');
      console.log('Token from cookie:', token);

      // Making the request to the API with the token in the Authorization header
      const response = await axios.get(API_URL + '/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in the Authorization header
        },
        withCredentials: true,  // Ensure cookies are sent with the request
      });
      console.log('Response:', response.data);

      // Updating state with the fetched notes
      this.setState({ notes: response.data.notes, loading: false });
      console.log('Response:', response.data);

    } catch (err) {
      // Handling errors and setting the error state
      this.setState({ error: 'Failed to fetch notes', loading: false });
    }
  };render() {
    const { notes, loading, error } = this.state;

    // Show loading indicator
    if (loading) {
      return <div>Loading...</div>;
    }

    // Show error message if an error occurred
    if (error) {
      return <div>{error}</div>;
    }

    // Render the list of notes or a message if no notes are available
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
  }
}
export default MyNotesView;
