import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import VolunteerEventLeaderboard from '../components/VolunteerEventLeaderboard';
import NonprofitBreakdown from '../components/NonprofitBreakdown';
import VolunteerSummary from '../components/VolunteerSummary';
import VolunteerGoals from '../components/VolunteerGoals';

const VolunteerAnalytics = () => {

    const user = localStorage.getItem("user_id");

    const [summary, setSummary] = useState([]);
    const [goals, setGoals] = useState([]);
    const [nonprofits, setNonprofits] = useState([]);
    const [events, setEvents] = useState([]);
    
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
    }, []);

    const getGoals = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/get-volunteer-goals/", {
                params: {
                    user: user,
                }
            });
            setGoals(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getGoals();
    }, []);
    
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
    }, []);
    
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
    }, []);
      

    return (
      <React.Fragment>
            <Typography.Title level={2}>Analytics</Typography.Title>
            <VolunteerSummary data={summary}/>
            <VolunteerGoals data={goals} />
            <NonprofitBreakdown data={nonprofits}/>
            <VolunteerEventLeaderboard data={events}/> 
        </React.Fragment>
    );
};export default VolunteerAnalytics;
