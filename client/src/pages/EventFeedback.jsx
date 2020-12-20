import React from 'react';
import { Typography } from 'antd';
import EventFeedbackForm from '../forms/EventFeedbackForm';
import './EventFeedback.css';

const EventFeedback = () => {
    return (
      <div className='event-feedback-container'>
            <Typography.Title level={2}>Event Feedback</Typography.Title>
            <EventFeedbackForm /> 
        </div>
    );
};


export default EventFeedback;  

