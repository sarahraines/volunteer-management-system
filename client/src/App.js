import React from 'react';
import { Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import { isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import NewOrg from './pages/NewOrg';
import Home from './pages/Home';
import Feed from './pages/Feed';
import './App.css';

function App() {
  return (
    <main>
      <Switch>
          <PrivateRoute exact path="/" component={isAuthenticated() ? Home : Feed}/>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create-organization" component={NewOrg} />
      </Switch> 
  </main>
  );
}

const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;

export default App;
