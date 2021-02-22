import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import VolunteerEventLeaderboard from '../components/VolunteerEventLeaderboard';
import NonprofitBreakdown from '../components/NonprofitBreakdown';
import VolunteerSummary from '../components/VolunteerSummary';

const VolunteerAnalytics = () => {

    const user = localStorage.getItem("user_id");

    const [summary, setSummary] = useState([]);
    
    const getSummary = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/volunteer-summary/", {
                params: {
                    user: user,
                }
            });
            setSummary(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getSummary();
    }, [getSummary, summary]);

    const [nonprofits, setNonprofits] = useState([]);
    
    const getNonprofits = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/nonprofit-breakdown/", {
                params: {
                    user: user,
                }
            });
            setNonprofits(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getNonprofits();
    }, [getNonprofits, nonprofits]);

    const [events, setEvents] = useState([]);
    
    const getEvents = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/volunteer-event-leaderboard/", {
                params: {
                    user: user,
                }
            });
            setEvents(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getEvents();
    }, [getEvents, events]);
      

    return (
      <React.Fragment>
            <Typography.Title level={2}>Analytics</Typography.Title>
            <VolunteerSummary data={summary}/>
            <NonprofitBreakdown data={nonprofits}/>
            <VolunteerEventLeaderboard data={events}/> 
        </React.Fragment>
    );
};export default VolunteerAnalytics;
