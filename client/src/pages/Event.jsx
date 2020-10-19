import React from 'react';
import { Layout, Typography } from 'antd';
import EventForm from '../forms/EventForm';
import LoginLogo from '../svg/login.svg';
import RegisterLogo from '../svg/register.svg';
import './Auth.css';

const Event = ({isRegister}) => {
    const title = "Create organization";
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
                  <EventForm isRegister={isRegister}/>
              </div>
          </Layout.Content>
      </Layout>
    );
  };


export default Event;