import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class SingleNoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,           // Store the fetched note data
      loading: true,        // Loading state for the request
      error: null           // Error state for the request
    };
  }

  componentDidMount() {
    this.fetchNote();
    console.log("SingleNoteView mounted with noteId:", this.state.noteId);
  }

  fetchNote = async () => {
    console.log("this.prps inside singlenoteView "+this.props);
    const { noteId } = this.props;  // Get the noteId passed from props
    try {
      const token = cookies.get('authToken');  // Retrieve the auth token from cookies

      // Make an API call to get the specific note by ID
      const response = await axios.get(`${API_URL}/notes/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token.id_users}`,  // Send token in Authorization header
        },
        withCredentials: true,  // Ensure cookies are sent with the request
      });

      // Update the state with the fetched note data
      this.setState({ note: response.data, loading: false });
    } catch (err) {
      // Handle errors and update the error state
      this.setState({ error: 'Failed to fetch note', loading: false });
    }
  };

  render() {
    console.log(" on themoney babyy");
    const { loading, error, note } = this.state;

    // Show loading indicator
    if (loading) {
      return <div>Loading...</div>;
    }

    // Show error message if an error occurred
    if (error) {
      return <div>{error}</div>;
    }

    // If note is null or undefined, show a fallback message
    if (!note) {
      return <div>No note found</div>;
    }

    // Render the note details
    return (
      <div className="container">
        <h2>{note.name_classes}</h2>  {/* Show the note's name or title */}
        <p>{note.description}</p>     {/* Show the note's description */}
        <div>
          <p>Content:</p>
          <p>{note.content}</p>       {/* Show the note's content or other details */}
        </div>
      </div>
    );
  }
}

SingleNoteView.propTypes = {
  noteId: PropTypes.string.isRequired,  // Make sure that noteId is passed as a prop
};

export default SingleNoteView;
