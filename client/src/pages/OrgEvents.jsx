import React, {useState, useEffect, useCallback} from 'react';
import { Typography, DatePicker, Select, Space, List, Input } from 'antd';
import "antd/dist/antd.css";
import './Event.css';
import EventCard from '../components/EventCard';
import axiosAPI from "../api/axiosApi";

const { Option } = Select;
const { RangePicker } = DatePicker;

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
        if (value === "virtual") {
            let newList = [];
            newList = oldList.filter(event =>
                event.virtual
            );
            setFilterDisplay(newList);
        } else if (value === "inperson") {
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
        } else if (value === "closed") {
            let newList = [];
            newList = oldList.filter(event =>
                !(event.attendee_count < event.attendee_cap)
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const dateFilterChange = value => {
        let oldList = events;
        if (value != null) {
            let start_date = new Date(value[0]);
            let end_date = new Date(value[1]);
            
            let newList = events.filter(e => {
                const bdate = new Date(e.begindate);
                const edate = new Date(e.enddate);
                return ((start_date.getMonth() <= edate.getMonth() && end_date.getMonth() >= bdate.getMonth())
                    && (start_date.getDate() <= edate.getDate() && end_date.getDate() >= bdate.getDate())
                    && (start_date.getFullYear() <= edate.getFullYear() && end_date.getFullYear() >= bdate.getFullYear()));
            })
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    return (
        <React.Fragment>
            <Typography.Title level={4}>Upcoming events</Typography.Title>
            <Space direction="vertical">
                <div style={{  width: "100%" }}>Search by name: <Input onChange={e => handleChange(e.target.value)} placeholder="Event name" size="medium" className="search" style={{height: 33.825, width: "40%", marginLeft: 4 }}/></div>
                <Space>
                    Filter by date:<Space direction="vertical" size={12}>
                        <RangePicker onChange={value => dateFilterChange(value)}/>
                    </Space>
                    Filter by open:<Select defaultValue="none" style={{ width: 120 }} onChange={value => openFilterChange(value)} size="medium">
                        <Option value="none">Select All</Option>
                        <Option value="open">Open</Option>
                        <Option value="closed">Closed</Option>
                    </Select>
                    Filter by virtual:<Select defaultValue="none" style={{ width: 120 }} onChange={value => virtualFilterChange(value)} size="medium">
                        <Option value="none">Select All</Option>
                        <Option value="virtual">Virtual</Option>
                        <Option value="inperson">Not Virtual</Option>
                    </Select>
                </Space> 
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
