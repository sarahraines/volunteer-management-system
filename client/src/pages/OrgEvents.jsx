import React, {useState, useEffect, useCallback} from 'react';
import {Form, Typography, Calendar} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";


const OrgEvents = ({orgId}) => {

    const [events, setEvents] = useState([]); 

    const getEventsByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("events/get-by-org/", {
                params: {
                    orgId: orgId
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [setEvents, orgId]);

    useEffect(() => {
        getEventsByOrg();
    }, [orgId]);
    
    const eventList = events.map(item => 
        <EventCard key={item.id} item={item} />
    );


    return (
        <React.Fragment>
            <Typography.Title level={4}>Upcoming events</Typography.Title>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
                {eventList}
            </div>
        </React.Fragment>
    );
}; export default OrgEvents;
