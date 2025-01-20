import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';
import { ADDNEWNOTE, MYCLASSES } from '../Utils/Constants';
import AddComment from './AddComment'; // Adjust the path based on your project structure
import CommentList from './CommentList'; // Adjust the path based on your project structure

const cookies = new Cookies();

class SingleNoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],         // Array to store the fetched image URLs
      loading: true,      // Loading state for the request
      error: null    ,
      showComments: false     // Error state for the request
    }
  }

  componentDidMount() {
    this.fetchNotes();
    console.log("console log inside SingleNoteVIew", this.props);
  }

  handleCommentAdded = () => {
    // Refresh comments when a new comment is added
    this.commentListRef.fetchComments();
  };

  toggleComments = () => {
    this.setState((prevState) => ({
      showComments: !prevState.showComments,
    }));
  };

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
          return { url: URL.createObjectURL(blob), id_notes: image.id_notes };
        });

        this.setState({ images: imageUrls, loading: false });
      } else {
        this.setState({ error: 'no images found', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'no images found', loading: false });
    }
  };

  handleDelete = async () => {
    const { noteId } = this.props;
    try {
      console.log("do tukej pride inside try pogoja")
      await axios.delete(API_URL + '/notes/deleteClass', {
        data: { id: noteId },
      });
      alert("Class deleted successfully");
      this.props.QSetView({ page: "MyClasses" }); // Redirect to Home or another view
    } catch (error) {
      console.error("Delete error:", error.message);
      this.setState({ error: "Failed to delete class." });
      this.props.QSetView({ page: "MyClasses" }); // Redirect to Home or another view

    }
  };

  handleDeleteNote = async (id_notes) => {
    try {
        const token = cookies.get('authToken');
        const response = await axios.delete(API_URL + '/notes/deleteNote', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { id_notes }, // Pass the id_notes in the body
        });

        if (response.data.success) {
            // Remove the deleted note from the state
            this.setState(prevState => ({
                images: prevState.images.filter(image => image.id_notes !== id_notes),
            }));
        } else {
            // Handle error if the note could not be deleted
            console.error('Failed to delete note:', response.data.message);
        }
    } catch (err) {
        console.error('Error deleting note:', err);
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
              this.props.QSetView({ page: ADDNEWNOTE, noteId: this.props.noteId, className:this.props.className }); 
            }}
            style={{ cursor: 'pointer' }}
            className="nav-link link-primary"
          >
            Add Note
          </a>
        </div>
        <button onClick={this.handleDelete} className="btn btn-danger mt-3">Delete Class</button>
      </div>
    </div>;
    if (!images.length) return <div>No images found
      <button onClick={this.handleDelete} className="btn btn-danger mt-3">Delete Class</button>
    </div>;

    return (
      <div className="container">
        
        <h2>{this.props.className}</h2>
        <div className="d-flex flex-column align-items-center"> {/* Center each image */}
          {this.state.images.map((image, index) => (
            <div key={image.id_notes} className="position-relative mb-4"> {/* Use id_notes as the key */}
              <img
                src={image.url}
                alt={`Uploaded Note ${index + 1}`}
                className="img-fluid"
                style={{ maxWidth: '80%', borderRadius: '8px' }}
              />
              <button
                onClick={() => this.handleDeleteNote(image.id_notes)} // Pass the unique id_notes to the delete function
                className="btn btn-danger position-absolute"
                style={{ right: '10px', top: '10px' }} // Adjust positioning as needed
              >
                Delete note
              </button>
            </div>
          ))}

          <div>
            <div>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.props.QSetView({ page: ADDNEWNOTE, noteId: this.props.noteId, className:this.props.className }); 
                }}
                style={{ cursor: 'pointer' }}
                className="nav-link link-primary"
              >
                Add Note
              </a>
            </div>
          </div>

        </div>

        <button onClick={this.handleDelete} className="btn btn-danger mt-3">Delete Class</button>
        
        <br></br>
        <br></br>
        <br></br>

        
        {/* Toggle Button for Showing/Hiding Comments */}
        <button onClick={this.toggleComments} className="btn btn-secondary mt-3">
          {this.state.showComments ? "Hide Comments" : "Show Comments"}
        </button>
                
        {this.state.showComments && (
          <div>
            <AddComment
              classId={this.props.noteId}
              id_users={this.props.user.id_users}
              onCommentAdded={this.handleCommentAdded} // Call to refresh comments
            />

            <CommentList
              classId={this.props.noteId}
              id_users={this.props.user.id_users}
              ref={(ref) => (this.commentListRef = ref)} // Reference for refreshing comments
            />
          </div>
        )}
      </div>
    );
  }
}

SingleNoteView.propTypes = {
  noteId: PropTypes.string.isRequired,
};

export default SingleNoteView;
