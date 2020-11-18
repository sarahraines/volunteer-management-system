import React from 'react';
import { Layout, Typography } from 'antd';
import NewEventForm from '../forms/NewEventForm';
import './NewEvent.css';

const NewEvent = () => {
    const title = "Create event";

    return (
      <div className='event-container'>
            <Typography.Title level={2}>Create event</Typography.Title>
            <NewEventForm />
        </div>
    );
};


export default NewEvent;  

