import React from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { API_URL } from "../Utils/Configuration";


class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_input: {
        username: "",
        password: ""
      },
      user: null,
      status: {
        success: null,
        msg: ""
      }
    }
  }

  handleLogin = (userData) => {
    this.setState({ user: userData.user, loggedIn: true });
  }

  /*QGetTextFromField=(e)=>{
    this.setState(prevState=>({
      user_input:{...prevState.user_input,[e.target.name]:e.target.value}
    }))
  }*/

  QGetTextFromField(e) {
    this.state.user_input[e.target.name] = e.target.value;
    this.setState({ user_input: this.state.user_input });
  }

  QPostLogin = () => {
    // TODO: you should validate the data before sending it to the server,
    if (this.state.user_input.username == "" |
      this.state.user_input.password == ""
    ) {
      //this.state.status= {success:false, msg:"Missing input filed"}
      this.setState(this.state.status = { success: false, msg: "Missing input filed" })
      console.log("wipiee")
      return
    }

    let req = axios.create({
      timeout: 20000,
      withCredentials: true,
    });

    req.post(API_URL + '/users/login',
      {
        username: this.state.user_input.username,
        password: this.state.user_input.password
      })
      .then(response => {
        console.log("Sent to server...")
        console.log(this.state.user_input)
        console.log(response.status)
        if (response.status == 200) {
          console.log(response.data)
          this.setState(this.state.status = response.data.status)
          this.setState(this.state.user = response.data.user)
          if (this.state.status.success) {
            this.props.QUserFromChild(response.data.user); // Pass user data to parent component
          }
          
        } else {
          console.log("Something is really wrong, DEBUG!")
        }

      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className="card"
        style={{ width: "400px", marginLeft: "auto", marginRight: "auto", marginTop: "10px", marginBottom: "10px" }}>
        <form style={{ margin: "20px" }} >
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="username" onChange={(e) => this.QGetTextFromField(e)}
              type="text"
              className="form-control"
              id="exampleInputEmail1" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input name="password" onChange={(e) => this.QGetTextFromField(e)}
              type="password"
              className="form-control"
              id="exampleInputPassword1" />
          </div>
           {/* TODO: Add checkbox using bootstrap and link onChange to a function that sets the state of remember_me*/}
        </form>
        <button style={{ margin: "10px" }} onClick={() => this.QPostLogin()}
          className="btn btn-primary bt">Sign</button>

        {/* TODO: We should display error to the user if something went wrong or a
        success message  if an item was added. Use paragraph with the following classNmes:
        => no success: <p className="alert alert-danger" role="alert"> 
        => success: <p className="alert alert-success" role="alert"> 
        */}
        {this.state.status.success ?
          <p className="alert alert-success"
            role="alert">{this.state.status.msg}</p> : null}

        {!this.state.status.success &&
          this.state.status.msg != "" ?
          <p className="alert alert-danger"
            role="alert">{this.state.status.msg}</p> : null}

      </div>
    )
  }
}

LoginView.propTypes = {
  QUserFromChild: PropTypes.func.isRequired,
};



export default LoginView