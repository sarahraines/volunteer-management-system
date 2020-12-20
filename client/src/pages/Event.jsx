import React, {useState, useEffect} from 'react';
import {Typography} from 'antd';
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
        <React.Fragment>
            <Typography.Title style={{ textAlign: "center" }} level={2}>Find service opportunities</Typography.Title>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
                {eventList}
            </div>
        </React.Fragment>
    );
}; export default Event;
