import React from "react";

import "./App.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { FacebookLoginButton } from "react-social-login-buttons";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import History from "./Components/History";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      views: {
        dashboard: this.changeToDashboard,
        register: this.changeToRegister,
        login: this.changeToLogin,
        history: this.changeToHistory,
      },
      curr_view: props => (
        <Login setUserName={this.setUserName} views={this.state.views}/>
      )
    };
  }

  setUserName = userName => {
    this.setState({userName}, console.log(this.state.userName));
  }

  changeToHistory = () => {
    this.setState({
      curr_view: props => (<History userName={this.state.userName} views={this.state.views} />)
    })
  }
  changeToDashboard = () => {
    this.setState({
      curr_view: props => (<Dashboard userName={this.state.userName} views={this.state.views}/>)
    });
  };

  changeToLogin = () => {
    this.setState({
      curr_view: props => (
          <Login setUserName={this.setUserName} views={this.state.views}/>
          )
    });
  }

  changeToRegister = () => {
    this.setState({
      curr_view: props => (<Register views={this.state.views} />)
    });
  }

  render() {
    
    return (
      // <Form className="landing-page">
      //   <h1>Numerical Weather Prediction Portal</h1>
      //   <FormGroup>
      //     <Button className="btn-lg btn-dark btn-block" onClick={Login}>
      //       <Route path="/" component={Login} />
      //     </Button>
      //   </FormGroup>
      //   <Button className="btn-lg btn-dark btn-block">Register</Button>
      // </Form>
      <Router>
        <div>
          {/* <Route path="/" component={this.state.curr_view} exact /> */}
          <Route path="/" render={this.state.curr_view} />
          {/*{this.state.curr_view}*/}
        </div>
      </Router>
    );
  }
}

export default App;
