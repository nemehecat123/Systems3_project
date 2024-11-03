// AddNoteView.js
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class AddNoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFiles: [], // Store selected files as an array
      success: null,
      error: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ imageFiles: Array.from(e.target.files) }); // Convert FileList to array
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const token = cookies.get('authToken');


    const { noteId } = this.props; // Access id_classes here
    console.log("Adding note to class ID:", noteId);
    try {

      const formData = new FormData();
      // Append each selected file to FormData
      this.state.imageFiles.forEach((file) => {
        formData.append('images', file); // 'images' should match backend's expected field name
      });

      await axios.post(
        API_URL + '/notes/addNoteWithImages',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${noteId}`,
          },
          withCredentials: true,
        }
      );

      this.setState({ success: 'Note added successfully!', error: null, imageFiles: [] });
    } catch (err) {
      console.error(err);
      this.setState({ error: 'Failed to add note. Please try again.', success: null });
    }
  };

  render() {
    const { noteTitle, noteContent, success, error } = this.state;

    return (
      <div className="container">
        <h2>Add a New Note with Images</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Note Title</label>
            <input
              type="text"
              className="form-control"
              name="noteTitle"
              value={noteTitle}
              onChange={this.handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Note Content</label>
            <textarea
              className="form-control"
              name="noteContent"
              value={noteContent}
              onChange={this.handleInputChange}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input
              type="file"
              className="form-control"
              name="images"
              onChange={this.handleFileChange}
              accept="image/*"
              multiple // Allow multiple file selection
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3">Add Note</button>

          {success && <p className="text-success mt-3">{success}</p>}
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
      </div>
    );
  }
}

AddNoteView.propTypes = {
  classId: PropTypes.string.isRequired,
};

export default AddNoteView;
