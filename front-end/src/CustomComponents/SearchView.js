import React from 'react';
import axios from 'axios';
import { API_URL } from "../Utils/Configuration";
import {SINGLENOTE } from '../Utils/Constants';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchResults: [],
      error: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ query: e.target.value });
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const { query } = this.state;

    try {
      const response = await axios.get(`${API_URL}/notes/searchClasses`, {
        params: { query }
      });
      this.setState({ searchResults: response.data, error: null });
    } catch (err) {
      console.error("Search error:", err);
      this.setState({ error: 'Failed to fetch search results.' });
    }
  };

  render() {
    const { query, searchResults, error } = this.state;

    return (
      <div className="container text-center">
        <h2>Search Classes</h2>
        
        <form onSubmit={this.handleSearch} style={{ marginTop: '2rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter class name"
            value={query}
            onChange={this.handleInputChange}
            style={{ maxWidth: '500px', margin: '0 auto' }}
            required
          />
          <button type="submit" className="btn btn-primary mt-3">Search</button>
        </form>

        <div className="row mt-4">
          {error && <p className="text-danger">{error}</p>}
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div className="col-md-4 mb-4" key={result.id_classes}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{result.name_classes}</h5>
                    <p className="card-text"><strong>Description:</strong> {result.description}</p>
                    <p className="card-text"><strong>Professor:</strong> {result.teacher_name}</p>
                    <p className="card-text"><strong>Owner:</strong> {result.owner}</p> {/* Display Owner's Name */}
                    <button
                      className="btn btn-link"
                      onClick={() => this.props.QSetView({ page: SINGLENOTE, noteId: result.id_classes })}
                    >
                      View Note
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No classes found</p>
          )}
        </div>
      </div>
    );
  }
}

export default SearchView;