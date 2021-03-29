import React, {useState, useEffect, useCallback} from 'react';
import { Calendar, Typography , Button, Popover} from 'antd';
import { usePageView } from '../utils/googleAnalytics'
import axiosAPI from "../api/axiosApi";
import VolunteerCalendarCard from './VolunteerCalendarCard';

const VolunteerCalendar = () => {
    const [events, setEvents] = useState([]); 
    const [goals, setGoals] = useState([]);
    const [titleDate, setTitleDate] = useState([]);
    usePageView('/calendar')

    const getVolunteerEvents = useCallback(async () => {
        try {
            const response = await axiosAPI.get("attendees/get-volunteer-events/", {
                params: {
                    user_id: localStorage.getItem("user_id"),
                }
            });
            console.log("events: " + response.data[0]);
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
            setGoals(response.data);
            console.log("goals: " + response.data[0].begindate + " - " + response.data[0].enddate);
            console.log("goals: " + response.data[1].begindate + " - " + response.data[1].enddate);

        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getVolunteerEvents();
        getVolunteerGoals();
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

    function getListGoalsBegin(value) {
        let listGoals;
        listGoals = goals.filter(goals => {
            const gyear = parseInt(goals.begindate.substring(0, 4), 10);
            const gmonth = parseInt(goals.begindate.substring(5, 7), 10);
            const gday = parseInt(goals.begindate.substring(8), 10);
            const returnValue = value.month() + 1 == gmonth && value.date() == gday && value.year() == gyear;
            console.log("bdate " + gyear + "-" + gmonth + "-" + gday + ", value " + value.year() + 
                "-" + value.month() + 1 + "-" + value.date() + ", returnVal " + returnValue);
            
            return value.month() + 1 == gmonth && value.date() == gday 
                && value.year() == gyear;
        })
        return listGoals || [];
    }

    function getListGoalsEnd(value) {
        let listGoals;
        listGoals = goals.filter(goals => {
            const gyear = parseInt(goals.enddate.substring(0, 4), 10);
            const gmonth = parseInt(goals.enddate.substring(5, 7), 10);
            const gday = parseInt(goals.enddate.substring(8), 10);
            const returnValue = value.month() + 1 == gmonth && value.date() == gday && value.year() == gyear;
            console.log("bdate " + gyear + "-" + gmonth + "-" + gday + ", value " + value.year() + 
                "-" + value.month() + 1 + "-" + value.date() + ", returnVal " + returnValue);
            
            return value.month() + 1 == gmonth && value.date() == gday 
                && value.year() == gyear;
        })
        return listGoals || [];
    }

    function getMonthGoals(value) {
        let monthGoals;
        monthGoals = goals.filter(goals => {
            const bdate = new Date(goals.begindate);
            const edate = new Date(goals.enddate);

            return ((value.month() <= edate.getMonth() && value.month() >= bdate.getMonth())
                && (value.year() <= edate.getFullYear() && value.year() >= bdate.getFullYear()));
        })

        return monthGoals || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        const goalsBeginData = getListGoalsBegin(value);
        const goalsEndData = getListGoalsEnd(value);
        return (
          <ul className="events">
            {goalsBeginData.map((item, i) => (
                <li key={i}>
                    <Button type="link" disabled={true} className="event-viewmore-form-button">
                        Start Goal: {item.hours}hrs
                    </Button>
                </li>
            ))}
            {goalsEndData.map((item, i) => (
                <li key={i}>
                    <Button type="link" disabled={true} className="event-viewmore-form-button">
                        End Goal: {item.hours}hrs
                    </Button>
                </li>
            ))}
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

