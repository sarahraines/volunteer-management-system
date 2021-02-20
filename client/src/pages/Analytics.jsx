import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import VolunteerLeaderboard from '../components/VolunteerLeaderboard';
import EventLeaderboard from '../components/EventLeaderboard';
import VolunteerBreakdown from '../components/VolunteerBreakdown';

const Analytics = ({orgId}) => {

    const [breakdown, setBreakdown] = useState([]);
    
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
            console.log('breakdown', breakdown); 
        }
    }, [getBreakdown, orgId, breakdown]);

    const [volunteers, setVolunteers] = useState([]);
    
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
    }, [getVolunteers, orgId, volunteers]); 


    const [events, setEvents] = useState([]);
    
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
    }, [getEvents, orgId, events]);
      

    return (
      <React.Fragment>
            <Typography.Title level={4}>Analytics</Typography.Title>
            <VolunteerBreakdown data={breakdown}/>
            <VolunteerLeaderboard data={volunteers}/>
            <EventLeaderboard data={events}/>
        </React.Fragment>
    );
};export default Analytics;
