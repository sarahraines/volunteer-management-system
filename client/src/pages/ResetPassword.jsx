import React from 'react';
import { Layout, Typography } from 'antd';
import RegisterLogo from '../svg/register.svg';
import './Auth.css';
import ResetPasswordForm from '../forms/ResetPasswordForm';

const ResetPassword = () => {
  const logo = RegisterLogo;
  return (
    <Layout style={{ height: "100vh" }}>
        <Layout.Content className="auth-content">
            <div className='auth-container'>
                <Typography.Title level={2}>Reset Password</Typography.Title>
                <img 
                    className="auth-logo"
                    src={logo} 
                    alt={"Reset Password logo"}
                />
                <ResetPasswordForm/>
            </div>
        </Layout.Content>
    </Layout>
  );
};


export default ResetPassword;