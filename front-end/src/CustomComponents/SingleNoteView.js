import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';
import { ADDNEWNOTE } from '../Utils/Constants';

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
    if (error) return <div>
      <div>
        {error}
        <div>
          <a
            onClick={(e) => {
              e.preventDefault();
              this.props.QSetView({ page: ADDNEWNOTE, noteId: this.props.noteId }); // Pass id_classes here
            }}
            style={{ cursor: 'pointer' }}
            className="nav-link link-primary"
          >
            Add Note
          </a>
        </div>
      </div>
    </div>;
    if (!images.length) return <div>No images found</div>;

    return (
      <div className="container">
        <div>
          <div>
            <a
              onClick={(e) => {
                e.preventDefault();
                this.props.QSetView({ page: ADDNEWNOTE, noteId: this.props.noteId }); // Pass id_classes here
              }}
              style={{ cursor: 'pointer' }}
              className="nav-link link-primary"
            >
              Add Note
            </a>
          </div>
        </div>
        <h2>Uploaded Images</h2>
        <div className="d-flex flex-column align-items-center"> {/* Center each image */}
          {images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Uploaded Note ${index + 1}`}
              className="img-fluid mb-4"
              style={{ maxWidth: '80%', borderRadius: '8px' }} // Centered, with some styling
            />
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
