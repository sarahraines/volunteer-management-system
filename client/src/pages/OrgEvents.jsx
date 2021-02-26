import React, {useState, useEffect, useCallback} from 'react';
import {Button, Typography, message, Select, Space} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import { usePageView } from '../utils/googleAnalytics'
import axiosAPI from "../api/axiosApi";

const { Option } = Select;

const OrgEvents = ({orgId}) => {
    const [events, setEvents] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);
    const [attendeeCount, setAttendeeCount] = useState([]); 

    usePageView('/events')

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

    const virtualFilterChange = value => {
        let oldList = events;
        if (value == "virtual") {
            let newList = [];
            newList = oldList.filter(event =>
                event.virtual
            );
            setFilterDisplay(newList);
        } else if (value == "inperson") {
            let newList = [];
            newList = oldList.filter(event =>
                !event.virtual
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const openFilterChange = value => {
        let oldList = events;
        if (value == "open") {
            let newList = [];
            newList = oldList.filter(event =>
                    (event.attendee_count < event.attendee_cap)
            );
            setFilterDisplay(newList);
        } else if (value == "filled") {
            let newList = [];
            newList = oldList.filter(event =>
                !(event.attendee_count < event.attendee_cap)
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    return (
        <React.Fragment>
            <Typography.Title level={4}>Upcoming events</Typography.Title>
            <Space>
                <input onChange={e => handleChange(e.target.value)} placeholder="Search for events" className="search"/>
                Filter by Virtual:<Select defaultValue="none" style={{ width: 120 }} onChange={value => virtualFilterChange(value)} size="small">
                    <Option value="none">Select All</Option>
                    <Option value="virtual">Virtual</Option>
                    <Option value="inperson">Not Virtual</Option>
                </Select>
                Filter by Open:<Select defaultValue="none" style={{ width: 120 }} onChange={value => openFilterChange(value)} size="small">
                    <Option value="none">Select All</Option>
                    <Option value="open">Open</Option>
                    <Option value="filled">Filled</Option>
                </Select>
            </Space> 
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
                {filterDisplay.map((item, i) => 
                    <EventCard key={i} item={item}/>
                )}
            </div>
            
        </React.Fragment>
    );
}; export default OrgEvents;
