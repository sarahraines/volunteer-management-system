import React from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from './pages/Auth';
import './App.css';

function App() {
  return (
    <main>
      <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
      </Switch>
  </main>
  );
}

const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;

export default App;
