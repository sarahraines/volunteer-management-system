import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
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
    const [events, setEvents] = useState([]);

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
            <Typography.Title level={4}>Analytics</Typography.Title>
                <NonprofitFunnel data ={funnel}/>
                <VolunteerBreakdown data={breakdown}/>
                <VolunteerLeaderboard data={volunteers}/>
                <EventLeaderboard data={events}/>
        </React.Fragment>
    );
};export default Analytics;
