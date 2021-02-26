import React, {useState, useEffect} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";


const Event = () => {
    const [events, setEvents] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);
    usePageView('/events');

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        try {
            const response = await axiosAPI.get("events/get/");
            setEvents(response.data);
            setFilterDisplay(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = e => {
        let oldList = events;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(event =>
                event.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    // const eventList = events.map(item => 
    //     <EventCard key={item.id} item={item} />
    // );

    return (
        <React.Fragment>
            <Typography.Title style={{ textAlign: "center" }} level={2}>Find service opportunities</Typography.Title>
            <input onChange={e => handleChange(e.target.value)} placeholder="Search for events"/>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
                {filterDisplay.map((item, i) => 
                    <EventCard key={i} item={item}/>
                )}
            </div>
        </React.Fragment>
    );
}; export default Event;
