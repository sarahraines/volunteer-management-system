import React from 'react';
import { Layout, Typography } from 'antd';
import EventForm from '../forms/NewOrgForm';
import './NewOrg.css';

const NewOrg = ({isRegister}) => {
    const title = "Create organization";
    return (
      <Layout style={{ height: "100vh" }}>
          <Layout.Content className="org-content">
              <div className='org-container'>
                  <Typography.Title level={2}>{title}</Typography.Title>
                  <EventForm isRegister={isRegister}/>
              </div>
          </Layout.Content>
      </Layout>
    );
};


export default NewOrg;