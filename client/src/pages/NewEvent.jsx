import React from 'react';
import { Layout, Typography } from 'antd';
import NewEventForm from '../forms/NewEventForm';
import './NewEvent.css';

const NewEvent = () => {
    const title = "Create event";
    return (
      <Layout style={{ height: "100vh" }}>
          <Layout.Content className="org-content">
              <div className='event-container'>
                  <Typography.Title level={2}>Create Event</Typography.Title>
                  <NewEventForm/>
              </div>
          </Layout.Content>
      </Layout>
    );
};


export default NewEvent; 