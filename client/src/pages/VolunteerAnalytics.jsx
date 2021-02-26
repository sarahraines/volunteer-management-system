import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import VolunteerEventLeaderboard from '../components/VolunteerEventLeaderboard';
import NonprofitBreakdown from '../components/NonprofitBreakdown';
import VolunteerSummary from '../components/VolunteerSummary';
import VolunteerGoals from '../components/VolunteerGoals';
import Plotly from 'react-plotly.js';

const VolunteerAnalytics = () => {

    const user = localStorage.getItem("user_id");

    const [monthlyHours, setMonthlyHours] = useState([]); 
    const [summary, setSummary] = useState([]);
    const [goals, setGoals] = useState([]);
    const [nonprofits, setNonprofits] = useState([]);
    const [events, setEvents] = useState([]);
    
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
            
            <Plotly 
                data={[{
                    type: 'scatter', 
                    marker: {color: 'blue'},
                    x: monthlyHours[0],
                    y: monthlyHours[1],
                    row: 1,
                    col: 1},
                    {type: 'bar', 
                    marker: {color: 'blue'},
                    x: monthlyHours[2],
                    y: monthlyHours[3],
                    xaxis: 'x2',
                    yaxis: 'y2',
                    row: 1,
                    col: 2},
                    ]}
                layout={{
                    grid: {rows: 1, 
                            columns: 2,
                            pattern: 'independent'},
                    showlegend: false,
                    title: 'Volunteer Hours'}}/>

            <VolunteerSummary data={summary}/>
            <VolunteerGoals data={goals} />
            <NonprofitBreakdown data={nonprofits}/>
            <VolunteerEventLeaderboard data={events}/> 
        </React.Fragment>
    );
};export default VolunteerAnalytics;
