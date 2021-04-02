import React, {useState, useEffect, useCallback} from 'react';
import {Typography, List, Select, Space} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";

const { Option } = Select;

const OrgEvents = ({orgId, isAdmin}) => {
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

    const updateEvents = () => {
        getEventsByOrg();
    }

    const removeEvent = useCallback(id => {
        setEvents(events.filter(event => event.id !== id));
        setFilterDisplay(events.filter(event => event.id !== id));
    }, [events]);

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
        if (value === "open") {
            let newList = [];
            newList = oldList.filter(event =>
                (event.attendee_count < event.attendee_cap)
            );
            setFilterDisplay(newList);
        } else if (value === "filled") {
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
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                }}
                dataSource={filterDisplay}
                renderItem={item => (
                    <List.Item>
                        <EventCard key={item.id} item={item} isAdmin={isAdmin} removeEvent={removeEvent} updateEvents={updateEvents} />
                    </List.Item>
                )}
            />
        </React.Fragment>
    );
}; export default OrgEvents;
