import React, {useState, useEffect, useCallback} from 'react';
import {Typography, Radio} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import NonprofitFunnel from '../components/NonprofitFunnel.jsx';
import VolunteerLeaderboard from '../components/VolunteerLeaderboard';
import EventLeaderboard from '../components/EventLeaderboard';
import VolunteerBreakdown from '../components/VolunteerBreakdown';


const Analytics = ({orgId}) => {

    const [funnel, setFunnel] = useState([0, 0, 0, 0])
    const [breakdown, setBreakdown] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [allVolunteers, setAllVolunteers] = useState([]);
    const [events, setEvents] = useState([]);

    const [view, setView] = useState('chart'); 

    const handleChange = e => {
        setView(e); 
    };

    const getFunnel = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/volunteer-funnel/", {
                params: {
                    org_id: orgId,
                }
            });
            setFunnel(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]); 

    useEffect(() => {
        if (orgId) {
            getFunnel(orgId);
        }
    }, []);
    
    const getBreakdown = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/volunteer-breakdown/", {
                params: {
                    org_id: orgId,
                }
            });
            setBreakdown(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        if (orgId) {
            getBreakdown(orgId);
        }
    }, []);
    
    const getVolunteers = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/volunteer-leaderboard/", {
                params: {
                    org_id: orgId,
                }
            });
            setVolunteers(response.data);
            setAllVolunteers(response.data[2]);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        if (orgId) {
            getVolunteers(orgId);
        }
    }, []); 

    const getEvents = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/event-leaderboard/", {
                params: {
                    org_id: orgId,
                }
            });
            setEvents(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        if (orgId) {
            getEvents(orgId);
        }
    }, []);


    return (
    <React.Fragment>
            <Radio.Group style={{ marginBottom: 16, float: 'right'}} onChange={e => handleChange(e.target.value)} defaultValue="chart">
                <Radio.Button value="chart">Chart View</Radio.Button>
                <Radio.Button value="table">Table View</Radio.Button>
            </Radio.Group>
            <Typography.Title level={4}>Analytics</Typography.Title>
            {view=='chart' ? (
                <NonprofitFunnel funnel = {funnel} breakdown = {breakdown} volunteers = {allVolunteers} events = {events}/>
            ) : (
                <React.Fragment>
                    <VolunteerBreakdown data={breakdown}/>
                    <VolunteerLeaderboard data={volunteers}/>
                    <EventLeaderboard data={events}/>
                </React.Fragment>
            )}
        </React.Fragment>
    )
};export default Analytics;
