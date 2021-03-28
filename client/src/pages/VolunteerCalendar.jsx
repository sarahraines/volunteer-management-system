import React, {useState, useEffect, useCallback} from 'react';
import { Calendar, Typography , Button, Popover} from 'antd';
import { usePageView } from '../utils/googleAnalytics'
import axiosAPI from "../api/axiosApi";
import VolunteerCalendarCard from './VolunteerCalendarCard';

const VolunteerCalendar = () => {
    const [events, setEvents] = useState([]); 
    const [titleDate, setTitleDate] = useState([]);
    usePageView('/calendar')

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

    const getVolunteerGoals = useCallback(async () => {
        try {
            const response = await axiosAPI.get("analytics/get-volunteer-goals/", {
                params: {
                    user: localStorage.getItem("user_id"),
                }
            });
            //setEvents(response.data);
            console.log("goals: " + response.data);

        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getVolunteerEvents();
        //getVolunteerGoals();
    }, []);

    function getMonthName(monthNo) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
            'October', 'November', 'December'][monthNo - 1];
    }

    function getListData(value) {
        setTitleDate(getMonthName(value.month()) + " " + value.year())

        let listData;
        listData = events.filter(events => {
            const bdate = new Date(events.events__begindate);
            const edate = new Date(events.events__enddate);

            // console.log("date issue " + value.year());
            // console.log("edate " + edate.getFullYear());

            return ((value.month() <= edate.getMonth() && value.month() >= bdate.getMonth())
                && (value.date() <= edate.getDate() && value.date() >= bdate.getDate())
                && (value.year() <= edate.getFullYear() && value.year() >= bdate.getFullYear()));
        })
        return listData || [];
    }

    function getMonthData(value) {
        setTitleDate(value.year())

        let monthData;
        monthData = events.filter(events => {
            const bdate = new Date(events.events__begindate);
            const edate = new Date(events.events__enddate);
            // console.log("date issue " + value.year());
            // console.log("edate " + edate.getFullYear());
            return ((value.month() <= edate.getMonth() && value.month() >= bdate.getMonth())
                && (value.year() <= edate.getFullYear() && value.year() >= bdate.getFullYear()));
        })

        return monthData || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item, i) => (
                <li key={i}>
                    <VolunteerCalendarCard key={i} item={item} isYearView={false}/>
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
                    <VolunteerCalendarCard key={i} item={item} isYearView={true}/>
                </li>
            ))}
          </ul>
        );
    }

    return (
        <div align="center">
            <Typography.Title level={2}>{titleDate}</Typography.Title>
            <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender}/>
        </div>
    );
};

export default VolunteerCalendar;  

