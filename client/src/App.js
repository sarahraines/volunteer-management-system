import React from 'react';
import { Route, Switch } from "react-router-dom";
import { isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Feed from './pages/Feed';
<<<<<<< HEAD
import Activate from './pages/Activate';
=======
// import ForgotPassword from './pages/ForgotPassword';
import Event from './pages/Event';
>>>>>>> 36736440b75e6b8690e9078c21176578f87c2654
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
      </Switch> 
  </main>
  );
}

const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;
export default App;
