import React from 'react';
import { Layout, Typography } from 'antd';
import RegisterLogo from '../assets/register.svg';
import './Auth.css';
// import ForgotPasswordForm from '../forms/ForgotPasswordForm';

const ForgotPassword = () => {
  const logo = RegisterLogo;
  return (
    <Layout style={{ height: "100vh" }}>
        <Layout.Content className="auth-content">
            <div className='auth-container'>
                <Typography.Title level={2}>Forgot Password</Typography.Title>
                <img 
                    className="auth-logo"
                    src={logo} 
                    alt={"Forgot Password logo"}
                />
                {/* <ForgotPasswordForm/> */}
            </div>
        </Layout.Content>
    </Layout>
  );
};


export default ForgotPassword;