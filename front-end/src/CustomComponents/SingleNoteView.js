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
  }

  fetchNote = async () => {
    const { noteId } = this.props;  // Get the noteId passed from props
    try {
      const token = cookies.get('authToken');  // Retrieve the auth token from cookies

      // Make an API call to get the specific note by ID
      const response = await axios.get(API_URL + '/notes/getNotes ', {
        headers: {
          'Authorization': `Bearer ${noteId}`,  // Send token in Authorization header
        },
        responseType:'blob',
        withCredentials: true,  // Ensure cookies are sent with the request
      });
      // Update the state with the fetched note data
      console.log(response.data);
      const imageUrl = URL.createObjectURL(response.data);
      // Update the state with the image URL and stop the loading state
      this.setState({ imageUrl, loading: false });

    } catch (err) {
      // Handle errors and update the error state
      this.setState({ error: 'Failed to fetch note', loading: false });

    }
  };

  render() {
    const { loading, error, imageUrl } = this.state;

    // Show loading indicator
    if (loading) {return <div>Loading...</div>;}

    // Show error message if an error occurred
    if (error) {return <div>{error}</div>;}

    // If note is null or undefined, show a fallback message
    if (!imageUrl) {return <div>No note found</div>;}
    console.log(imageUrl)
    // Render the note details
    return (
        <div className="container">
        <img src={imageUrl} alt="Uploaded Note" style={{ maxWidth: '100%' }} />
        </div>
    );
  }
}

SingleNoteView.propTypes = {
  noteId: PropTypes.string.isRequired,  // Make sure that noteId is passed as a prop
};

export default SingleNoteView;
