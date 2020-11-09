import React, {useCallback} from 'react';
import { Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import { getFAQ, isAuthenticated } from './api/authenticationApi';
import Auth from './pages/Auth';
import NewOrg from './pages/NewOrg';
import Home from './pages/Home';
import Feed from './pages/Feed';
import './App.css';
import OrgOnboarding from './pages/OrgOnboarding';
import QAndAPage from './pages/QAndAPage';

function App() {

  const FAQ = () => <QAndAPage orgId={1}/>
  return (
    <main>
      <Switch>
          <PrivateRoute exact path="/" component={isAuthenticated() ? Home : Feed}/>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create-organization" component={NewOrg} />
          <Route path="/q-and-a" component={FAQ} />
          {/* <Route path="/organization-onboarding" component={OrgOnboarding} /> */}
      </Switch> 
  </main>
  );
}


const Register = () => <Auth isRegister={true}/>;
const Login = () => <Auth isRegister={false}/>;

export default App;
