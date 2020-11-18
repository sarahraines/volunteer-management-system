import React from 'react';
import { Route, Switch } from "react-router-dom";
import { isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Activate from './pages/Activate';
// import ForgotPassword from './pages/ForgotPassword';
import Event from './pages/Event';
import NewEvent from './pages/NewEvent'
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
          <Route path="/events" component={Event} />
          <Route path="/NewEvent" component={NewEvent} />
          <Route path="/feed" component={Feed} />
      </Switch> 
  </main>
  );
}

const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;
export default App;
