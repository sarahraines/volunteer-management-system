import React, {useState, useEffect} from 'react';
import {Form, Typography} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventOrganizer from '../components/EventOrganizer';
import axiosAPI from "../api/axiosApi";


const Event = () => {

    const [events, setEvents] = useState([]); 
    const [user_events, setUserEvents] = useState([]); 

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        try{
            const response = await axiosAPI.get("events/get/");
            setEvents(response.data);
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAttendees();
    }, []);

    const getAttendees = async () => {
        try{
            const response = await axiosAPI.get("attendees/user_events/");
            setUserEvents(response.data);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className='event-container'>
            <Typography.Title level={2}>View Events</Typography.Title>
            <img 
                className="event-logo"
            />
            <Form
                name="attendee"
                className="attendee-form"
                initialValues={{ remember: true }}
            >
            <EventOrganizer events={events} user_events={user_events} />

            </Form>
           
        </div>
    );
}; export default Event;
