import React, {useEffect} from 'react';
import { Route, Switch } from "react-router-dom";
import { isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import Home from './pages/Home/Home';
import Feed from './pages/Feed';
import InviteNoAuth from './pages/InviteNoAuth';
import Activate from './pages/Activate';
import EventFeedback from './pages/EventFeedback'
import './App.css';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {

  useEffect(() => {
    document.title = "VolunteerSense"
  }, []);

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
          <Route path="/feedback" component={EventFeedback} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPasswordNoAuth} />
      </Switch> 
  </main>
  );
}


const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;
const ResetPasswordNoAuth = () => <ResetPassword isAuthenticated={false}/>;
export default App;
