import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';



class AddComment extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        commentText: '',
        error: null,       // Error state for the request
      };
    }
  
    handleCommentChange = (e) => {
      this.setState({ commentText: e.target.value });
      console.log(this.state)
     
    };
  
    handleSubmitComment = async (e) => {
      e.preventDefault();
      console.log(this.props, "inside handle sumbit comment");
      const { commentText } = this.state;
     
  
      try {
       
        await axios.post(API_URL + '/notes/addComment', {
          id_classes: this.props.classId,
          id_users: this.props.id_users, // Assuming the token holds the user ID
          content: commentText,
        }, {
          withCredentials: true,
        });
  
        this.setState({ commentText: '', error: null });
        // Optionally, refresh the comment list here
        this.props.onCommentAdded();
      } catch (error) {
        this.setState({ error: 'Failed to add comment. Please try again.' });
      }
    };

    render() {
      return (
        <form onSubmit={this.handleSubmitComment}>
          <textarea
            value={this.state.commentText}
            onChange={this.handleCommentChange}
            placeholder="Write your comment here..."
            rows="4"
            required
          />
          <button type="submit" className="btn btn-primary mt-2">Add Comment</button>
          {this.state.error && <div className="text-danger">{this.state.error}</div>}
        </form>
      );
    }
  }

export default AddComment;
