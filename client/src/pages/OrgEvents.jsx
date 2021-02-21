import React, {useState, useEffect, useCallback} from 'react';
import {Button, Typography, message, Input} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";

const OrgEvents = ({orgId}) => {
    const [events, setEvents] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);

    const getEventsByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("events/get-by-org/", {
                params: {
                    orgId: orgId,
                }
            });
            setEvents(response.data);
            setFilterDisplay(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [setEvents, orgId]);

    useEffect(() => {
        getEventsByOrg();
    }, [orgId, getEventsByOrg]);
    
    // const eventList = events.map(item => 
    //     <EventCard key={item.id} item={item}/>
    // );

    const handleChange = e => {
        let oldList = events;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(event =>
                event.name.includes(e)
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };


    return (
        <React.Fragment>
            <Typography.Title level={4}>Upcoming events</Typography.Title>
            <input onChange={e => handleChange(e.target.value)} placeholder="Search for events"/>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
                {filterDisplay.map((item, i) => 
                    <EventCard key={i} item={item}/>
                )}
            </div>
        </React.Fragment>
    );
}; export default OrgEvents;
