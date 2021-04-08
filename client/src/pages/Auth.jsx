import React, { useCallback } from 'react';
import { Layout, Typography, Alert } from 'antd';
import AuthForm from '../forms/AuthForm';
import LoginLogo from '../assets/login.svg';
import RegisterLogo from '../assets/register.svg';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { removeAlert } from '../actionCreators.js';
import { usePageView } from '../utils/googleAnalytics'
import './Auth.css';

const Auth = ({isRegister}) => {
  const title = isRegister ? "Create account" : "Log in";
  const logo = isRegister ? RegisterLogo: LoginLogo;
  const alerts = useSelector(state => state.alerts, shallowEqual);
  const dispatch = useDispatch();
  usePageView(isRegister ? '/register' : '/login');

  const onClose = useCallback((id) => {
    setTimeout(() => dispatch(removeAlert(id)), 500);
  }, [dispatch]);

  const alertList = alerts.map(alert => 
    <Alert
      key={alert.id}
      type={alert.alert_type}
      message={alert.message}
      banner
      closable
      onClose={() => onClose(alert.id)}
    />
  );

  return (
    <Layout style={{ height: "100vh" }}>
      {alertList}
        <Layout.Content className="auth-content">
            <div className='auth-container'>
                <Typography.Title level={2}>{title}</Typography.Title>
                <img 
                    className="auth-logo"
                    src={logo} 
                    alt={title + " logo"}
                />
                <AuthForm isRegister={isRegister}/>
            </div>
        </Layout.Content>
    </Layout>
  );
};


export default Auth;