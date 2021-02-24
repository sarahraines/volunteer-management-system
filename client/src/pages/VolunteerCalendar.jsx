import React, {useState, useEffect, useCallback} from 'react';
import { Calendar, Typography , Button, Popover} from 'antd';
import axiosAPI from "../api/axiosApi";
import VolunteerCalendarCard from './VolunteerCalendarCard';

const VolunteerCalendar = () => {
    const [events, setEvents] = useState([]); 

    const getVolunteerEvents = useCallback(async () => {
        try {
            const response = await axiosAPI.get("attendees/get-volunteer-events/", {
                params: {
                    user_id: localStorage.getItem("user_id"),
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getVolunteerEvents();
    }, []);

    function getListData(value) {
        let listData;
        listData = events.filter(events => {
            const bdate = new Date(events.events__begindate);
            const edate = new Date(events.events__enddate);

            return ((value.month() <= edate.getMonth() && value.month() >= bdate.getMonth())
                && (value.date() <= edate.getDate() && value.date() >= bdate.getDate()));
        })
        return listData || [];
    }

    function getMonthData(value) {
        let monthData;
        monthData = events.filter(events => {
            const bdate = new Date(events.events__begindate);
            const edate = new Date(events.events__enddate);

            return ((value.month() <= edate.getMonth() && value.month() >= bdate.getMonth()));
        })

        return monthData || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item, i) => (
                <li key={i}>
                    <VolunteerCalendarCard key={i} item={item}/>
                </li>
            ))}
          </ul>
        );
      }

    function monthCellRender(value) {
        const monthData = getMonthData(value);
        return (
            <ul className="events">
            {monthData.map((item, i) => (
                <li key={i}>
                    <VolunteerCalendarCard key={i} item={item}/>
                </li>
            ))}
          </ul>
        );
      }

    return (
        <div align="center">
            <Typography.Title level={2}>View My Events</Typography.Title>
            <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
        </div>
    );
};

export default VolunteerCalendar;  

