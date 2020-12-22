import React from 'react';
import { Route, Switch } from "react-router-dom";
import { isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import Home from './pages/Home/Home';
import Feed from './pages/Feed';
import InviteNoAuth from './pages/InviteNoAuth';
import Activate from './pages/Activate';
// import ForgotPassword from './pages/ForgotPassword';
import Event from './pages/Event';
import NewEvent from './pages/NewEvent'
import EventFeedback from './pages/EventFeedback'
import './App.css';

function App() {

  return (
    <main>
      <Switch>
          <Route exact path="/" 
            render={() =>
              isAuthenticated() ? (
                <Feed/>
              ) : (
                <Home/>
              )
            }
          />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/activate" component={Activate} />
          <Route path="/invite" component={InviteNoAuth} />
          <Route path="/events" component={Event} />
          <Route path="/NewEvent" component={NewEvent} />
          <Route path="/feed" component={Feed} />
          <Route path="/EventFeedback" component={EventFeedback} />
      </Switch> 
  </main>
  );
}


const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;
export default App;
