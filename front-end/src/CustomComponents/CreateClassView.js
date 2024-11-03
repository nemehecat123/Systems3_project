import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class CreateClassView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      teacher: '',
      yearOfClass: '',
      error: null,
      success: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();


    const token = cookies.get('authToken');
    console.log('(CreateClassView )---Token from cookie:', token);

    try {
      await axios.post(API_URL + '/notes/createNewClass',
        {
          name: this.state.name,
          description: this.state.description,
          teacher: this.state.teacher,
          yearOfClass: this.state.yearOfClass,
        },
        {
          headers: {
            'Authorization': `Bearer ${token.id_users}`,  // Send token in the Authorization header
          },
          withCredentials: true,
        }
      );
      this.setState({ success: 'Class created successfully!', error: null });
    } catch (err) {
      console.log(err.message);
      this.setState({ error: 'Failed to create class. Please try again.', success: null });
    }
  };
  render() {
    const { name, description, teacher, yearOfClass, error, success } = this.state;

    return (
      <div className="container">
        <h2>Create a New Class</h2>
        <form onSubmit={this.handleSubmit}>

          {/* Class Name */}
          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              value={description}
              onChange={this.handleInputChange}
              rows="4"
              required
            ></textarea>
          </div>

          {/* Teacher */}
          <div className="form-group">
            <label>Teacher</label>
            <input
              type="text"
              className="form-control"
              name="teacher"
              value={teacher}
              onChange={this.handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year of the Class</label>
            <div className="input-group">
              <input
                className="form-control"
                name="yearOfClass"
                value={yearOfClass}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">Create Note</button>

          {/* Success and Error Messages */}
          {success && <p className="text-success mt-3">{success}</p>}
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>

        <button className="btn btn-primary mt-3" onClick={console.log(this.state)}>naredi nekej</button>
      </div>


    );
  }
}

CreateClassView.propTypes = {
  QSetView: PropTypes.func.isRequired // For navigating back if needed
};

export default CreateClassView;
