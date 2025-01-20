import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';



class CommentList extends React.Component {
  state = {
    comments: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchComments();
    console.log(this.props," inside comentList");
  }

  fetchComments = async () => {

    try {
      const response = await axios.get(`${API_URL}/notes/getComments`, {
        params: {
          id_classes: this.props.classId, // Send id_classes as a query parameter
        },
        withCredentials: true,
      });

     

      if (response.data.success) {
        this.setState({ comments: response.data.comments, loading: false });
      } else {
        this.setState({ error: 'Failed to load comments', loading: false });
      }
    } catch (error) {
      this.setState({ error: 'Failed to fetch comments', loading: false });
    }
  };

  render() {
    const { comments, loading, error } = this.state;

    if (loading) return <div>Loading comments...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div>
        <h2>Comments</h2>
        {comments.length === 0 ? (
          <div>No comments yet.</div>
        ) : (
          <ul className="list-group">
            {comments.map((comment) => (
              <li key={comment.id_comment} className="list-group-item">
                <p><strong>User {comment.id_users}:</strong> {comment.content}</p>
                <small>{new Date(comment.changed).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default CommentList;
