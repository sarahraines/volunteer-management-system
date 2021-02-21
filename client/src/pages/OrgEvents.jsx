import React, {useState, useEffect, useCallback} from 'react';
import {Button, Typography, message, Select, Space} from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";

const { Option } = Select;

const OrgEvents = ({orgId}) => {
    const [events, setEvents] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);
    const [attendeeCount, setAttendeeCount] = useState([]); 

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

    // const getAttendeeCount = useCallback(async (eventId) => {
	// 	try {
	// 		const response = await axiosAPI.get("events/get-event-attendee-count/", {
    //             params: {
	// 				event: eventId
    //             }
    //         });
    //         console.log("gets here");
    //         setAttendeeCount(response.data);
	// 	}
	// 	catch {
	// 		const errMsg = "Get Attendee Count failed";
	// 		message.error(errMsg);
	// 	}
    // }, []);

    const openFilterChange = value => {
        let oldList = events;
        if (value == "open") {
            let newList = [];
            
            newList = oldList.filter(event =>
                    (event.attendee_count < event.attendee_cap)
            );
            console.log("newList: " + newList)
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
                <input onChange={e => handleChange(e.target.value)} placeholder="Search for events" class="search"/>
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
