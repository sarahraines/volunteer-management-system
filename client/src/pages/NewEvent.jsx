import React from 'react';
import { Typography } from 'antd';
import NewEventForm from '../forms/NewEventForm';
import { usePageView } from '../utils/googleAnalytics'
import './NewEvent.css';

const NewEvent = () => {
    usePageView('/new-event')

    return (
      <div className='event-container'>
            <Typography.Title level={2}>Create an event</Typography.Title>
            <NewEventForm />
        </div>
    );
};


export default NewEvent;  

