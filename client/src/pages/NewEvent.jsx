import React from 'react';
import { Typography } from 'antd';
import NewEventForm from '../forms/NewEventForm';
import './NewEvent.css';

const NewEvent = () => {
    return (
      <div className='event-container'>
            <Typography.Title level={2}>Create an event</Typography.Title>
            <NewEventForm />
        </div>
    );
};


export default NewEvent;  

