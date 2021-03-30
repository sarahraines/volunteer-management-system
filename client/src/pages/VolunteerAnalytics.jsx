import React, {useState, useEffect, useCallback} from 'react';
import {Typography, Radio} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import VolunteerEventLeaderboard from '../components/VolunteerEventLeaderboard';
import NonprofitBreakdown from '../components/NonprofitBreakdown';
import VolunteerSummary from '../components/VolunteerSummary';
import VolunteerCharts from '../components/VolunteerCharts'; 

import Plotly from 'react-plotly.js';
import { usePageView } from '../utils/googleAnalytics'

const VolunteerAnalytics = () => {

    const user = localStorage.getItem("user_id");

    const [monthlyHours, setMonthlyHours] = useState([]); 
    const [summary, setSummary] = useState([]);
    const [nonprofits, setNonprofits] = useState([]);
    const [events, setEvents] = useState([]);

    const [view, setView] = useState('chart'); 

    const handleChange = e => {
        setView(e); 
    };
    
    const getMonthlyHours = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/get-monthly-hours/", {
                params: {
                    user: user,
                }
            });
            setMonthlyHours(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getMonthlyHours();
    }, []);
    usePageView('/volunteer-analytics');

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
            <Radio.Group style={{ marginBottom: 16, float: 'right'}} onChange={e => handleChange(e.target.value)} defaultValue="chart">
                <Radio.Button value="chart">Chart View</Radio.Button>
                <Radio.Button value="table">Table View</Radio.Button>
            </Radio.Group>
            <Typography.Title level={4}>Analytics</Typography.Title>
            {view=='chart' ? (
                <VolunteerCharts monthlyHours={monthlyHours} nonprofits={nonprofits} events={events}/>
            ) : (
                <React.Fragment>
                    <VolunteerSummary data={summary}/>
                    <NonprofitBreakdown data={nonprofits}/>
                    <VolunteerEventLeaderboard data={events}/>
                </React.Fragment>
            )}
            </React.Fragment>
        ); 
};export default VolunteerAnalytics;
