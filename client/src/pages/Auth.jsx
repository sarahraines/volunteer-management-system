import React from 'react';
import { Layout, Typography } from 'antd';
import AuthForm from '../forms/AuthForm';
import LoginLogo from '../svg/login.svg';
import RegisterLogo from '../svg/register.svg';
import './Auth.css';

const Auth = ({isRegister}) => {
  const title = isRegister ? "Create account" : "Log in";
  const logo = isRegister ? RegisterLogo: LoginLogo;
  return (
    <Layout style={{ height: "100vh" }}>
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