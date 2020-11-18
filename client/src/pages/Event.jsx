import React, {useState, useEffect} from 'react';
import {Form, Typography} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";


const Event = () => {

    const [events, setEvents] = useState([]); 

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        try {
            const response = await axiosAPI.get("events/get/");
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const eventList = events.map(item => 
        <EventCard key={item.id} item={item} />
    );

    return (
        <div className='event-container'>
            <Typography.Title level={4}>Find service opportunities</Typography.Title>
            <Form
                name="attendee"
                className="attendee-form"
                initialValues={{ remember: true }}
            >
                {eventList}
            </Form>
           
        </div>
    );
}; export default Event;
