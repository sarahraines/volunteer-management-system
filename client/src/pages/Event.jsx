import React from 'react';
import { Layout, Typography } from 'antd';
import EventForm from '../forms/EventForm';
import LoginLogo from '../svg/login.svg';
import RegisterLogo from '../svg/register.svg';
import './Auth.css';

const Event = () => {
  return (
    <Layout style={{ height: "100vh" }}>
        <Layout.Content className="auth-content">
            <div className='auth-container'>
                <Typography.Title level={2}>Test</Typography.Title>
            </div>
        </Layout.Content>
    </Layout>
  );
};


export default Event;