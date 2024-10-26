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
      images: [],         // Array to store the fetched image URLs
      loading: true,      // Loading state for the request
      error: null         // Error state for the request
    };
  }

  componentDidMount() {
    this.fetchNotes();
  }

  fetchNotes = async () => {
    const { noteId } = this.props;
    try {
      const token = cookies.get('authToken');

      // Make an API call to get all images for the specific note ID
      const response = await axios.get(API_URL + '/notes/getNotes', {
        headers: {
          'Authorization': `Bearer ${noteId}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        // Convert each image blob to a URL
        const imageUrls = response.data.images.map(image => {
          const blob = new Blob([Uint8Array.from(atob(image.data), c => c.charCodeAt(0))], { type: image.fileType });
          return URL.createObjectURL(blob);
        });

        this.setState({ images: imageUrls, loading: false });
      } else {
        this.setState({ error: 'Failed to load images', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to fetch images', loading: false });
    }
  };

  render() {
    const { loading, error, images } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!images.length) return <div>No images found</div>;

    return (
      <div className="container">
        <h2>Note Images</h2>
        <div className="row">
          {images.map((imageUrl, index) => (
            <div className="col-md-4" key={index}>
              <img src={imageUrl} alt={`Note ${index + 1}`} style={{ maxWidth: '100%', marginBottom: '20px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

SingleNoteView.propTypes = {
  noteId: PropTypes.string.isRequired,
};

export default SingleNoteView;
