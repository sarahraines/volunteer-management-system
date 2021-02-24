import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import Plot from 'react-plotly.js';
import EventsPerVolunteer from './EventsPerVolunteer.jsx';
import VolunteerLeaderboard from '../components/VolunteerLeaderboard';
import EventLeaderboard from '../components/EventLeaderboard';
import VolunteerBreakdown from '../components/VolunteerBreakdown';

const Analytics = ({orgId}) => {

    const [breakdown, setBreakdown] = useState([]);
    const [orgCount, setOrgCount] = useState([]); 
    const [attendeeCount, setAttendeeCount] = useState([]); 
    
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

    const getAnalyticsByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("organization/get-member-counts-by-org/", {
                params: {
                    orgId: orgId
                }
            });
            setOrgCount(response.data);
            console.log('response', response.data)
        } catch (error) {
            console.error(error);
        }
    }, [setOrgCount, orgId]);

    const getAnalyticsByEvent = useCallback(async () => {
        try {
            const response = await axiosAPI.get("events/get-attendee-counts-by-event/", {
                params: {
                    orgId: orgId
                }
            });
            setAttendeeCount(response.data);
            console.log('response2', response.data)
        } catch (error) {
            console.error(error);
        }
    }, [setAttendeeCount, attendeeCount, orgId]);

    useEffect(() => {
        if (orgId) {
            getBreakdown(orgId);
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
        getAnalyticsByEvent();
    }, [orgId]); 

    useEffect(() => {
        getAnalyticsByOrg();
    }, [orgId, getAnalyticsByOrg]);

    useEffect(() => {
        if (orgId) {
            getEvents(orgId);
        }
    }, [getEvents, orgId, events]);
      

    return (
      <React.Fragment>
            <Typography.Title level={4}>Analytics</Typography.Title>
                <Plot
                    data={[
                      {type: 'bar', x: ['admins', 'members'], y: orgCount},
                    ]}
                    layout={ {width: 480, height: 360, title: 'User Count (Admin vs. Members)'} }
                />
                <Plot
                    data={[
                      {type: 'bar', x: attendeeCount[0], y: attendeeCount[1]},
                    ]}
                    layout={ {width: 480, height: 360, title: 'Event Attendees Count'} }
                />
                <EventsPerVolunteer orgId ={orgId}/>
            <VolunteerBreakdown data={breakdown}/>
            <VolunteerLeaderboard data={volunteers}/>
            <EventLeaderboard data={events}/>
        </React.Fragment>
    );
};export default Analytics;
