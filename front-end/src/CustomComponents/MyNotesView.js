import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';
import { SINGLENOTE } from '../Utils/Constants';

const cookies = new Cookies();
class MyNotesView extends React.Component {


constructor(props) {
    super(props);
    this.state = {
      status: {
        success: null,
        msg: ""
      },
      notes: [],       
      loading: true,    
      error: null        
    }
  }


  componentDidMount() {
    console.log(this.state.user)
    this.fetchNotes();
  }

  fetchNotes = async () => {
    try {
      const token = cookies.get('authToken');
      console.log('(MyNotesView )---Token from cookie:', token);
      console.log(token.id_users)

      // Making the request to the API with the token in the Authorization header
      const response = await axios.get(API_URL + '/notes', {
        headers: {
          'Authorization': `Bearer ${token.id_users}`,  // Send token in the Authorization header
        },
        withCredentials: true,  // Ensure cookies are sent with the request
      });
      console.log('Response:', response.data.notes);

      // Updating state with the fetched notes
      this.setState({ notes: response.data, loading: false });

    } catch (err) {
      // Handling errors and setting the error state
      this.setState({ error: 'Failed to fetch notes', loading: false });
    }
  };render() {
    const { loading, error, notes  } = this.state;

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
              
              <div className="col-md-4" key={note.id_classes }>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{note.name_classes}</h5>
                    <p className="card-text">{note.description}</p>
                      <a
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default anchor behavior
                        this.QSetView({ page: SINGLENOTE }); // Call your function
                      }}
                      className="nav-link"
                      class="link-primary"
                    >
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
