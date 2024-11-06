import { Component } from "react";
import { ABOUT,SIGNUP, LOGIN, HOME, LOGOUT, MYCLASSES, SINGLENOTE, CREATECLASS, ADDNEWNOTE, SEARCHVIEW } from "./Utils/Constants"
import HomeView from "./CustomComponents/HomeView";
import AboutView from "./CustomComponents/AboutView";
import SignupView from "./CustomComponents/SignupView";
import LoginView from "./CustomComponents/LoginView";
import AddNoteView from "./CustomComponents/AddNoteView";
import MyClassesView from "./CustomComponents/MyClassesView";
import SingleNoteView from "./CustomComponents/SingleNoteView";
import CreateClassView from "./CustomComponents/CreateClassView";
import SearchView from "./CustomComponents/SearchView";

import axios from "axios";
import { API_URL } from "./Utils/Configuration";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
//   sdsds
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: HOME,
      Novica: 1,
      loggedIn: false,
      status: {
        success: null,
        msg: ""
      },
      user: null
    };
  }

  QGetView(state) {
    const page = state.CurrentPage;
    switch (page) {
      case ABOUT:
        return <AboutView />;
      case SIGNUP:
        return <SignupView />;
      case LOGIN:
        return <LoginView QUserFromChild={this.QSetLoggedIn} />;
      case LOGOUT:
        return <HomeView />;
      case CREATECLASS:
        return <CreateClassView QSetView={this.QSetView} />;
      case MYCLASSES:
        return <MyClassesView user={this.state.user} QSetView={this.QSetView} />;
      case SINGLENOTE:
        return <SingleNoteView noteId={this.state.noteId} QSetView={this.QSetView} user={this.state.user}/>
      case ADDNEWNOTE:
        return <AddNoteView noteId={this.state.noteId} />
      case SEARCHVIEW:
        return <SearchView QSetView={this.QSetView} />;
      default:
        return <HomeView />;
    }
  };

  QSetView = (obj) => {
    console.log("(QsetView in ap.js ) obj.noteId :  "+ obj.noteId)

    console.log(obj)
    this.setState({
      CurrentPage: obj.page,
      noteId: obj.noteId || null,
      }, () => {
          // This callback will be executed after the state has been updated
          console.log("State after QSetView:", this.state);
      });
    
  };

  QLogout = () => {
    this.setState({ loggedIn: false, user: null, CurrentPage: HOME });
    axios.get(API_URL + '/users/logout')
      .then(response => {
        if (response.data.success) {
          this.setState({ loggedIn: false, user: null });
        }
      })
      .catch(err => console.log(err));

  };

  QSetLoggedIn = (userData) => {
    this.setState({ loggedIn: true, user: userData, CurrentPage: HOME }, () => {
      console.log(this.state.user); // This will now log the correct user object
    });
  };

  render() {
    return (
      <div id="APP" className="container">
      <div id="menu" className="row">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <a
              onClick={this.QSetView.bind(this, { page: "home" })}
              className="navbar-brand"
              href="#"
            >
              Home
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
    
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              {this.state.loggedIn ? (
                <>
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a
                        onClick={this.QSetView.bind(this, { page: ABOUT })}
                        className="nav-link"
                        href="#"
                      >
                        About
                      </a>
                    </li>
    
                    <li className="nav-item">
                      <a
                        onClick={this.QSetView.bind(this, { page: MYCLASSES })}
                        className="nav-link"
                        href="#"
                      >
                        My Classes
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        onClick={this.QSetView.bind(this, { page: SEARCHVIEW })}
                        className="nav-link"
                        href="#"
                      >
                        Search Classes
                      </a>
                    </li>

                  </ul>
                  
    
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a
                        onClick={this.QLogout}
                        className="nav-link"
                        href="#"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </>
              ) : (
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a
                      onClick={this.QSetView.bind(this, { page: SIGNUP })}
                      className="nav-link"
                      href="#"
                    >
                      Sign up
                    </a>
                  </li>
    
                  <li className="nav-item">
                    <a
                      onClick={this.QSetView.bind(this, { page: LOGIN })}
                      className="nav-link"
                      href="#"
                    >
                      Login
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
    
      <div id="viewer" className="row container">
        {this.QGetView(this.state)}
      </div>
    </div>
    );
  }
}

export default App;
