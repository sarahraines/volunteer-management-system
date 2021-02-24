import React, {useState, useEffect, useCallback} from 'react';
import {Typography} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import Plot from 'react-plotly.js';
import EventsPerVolunteer from './EventsPerVolunteer.jsx';

const Analytics = ({orgId}) => {

    const [orgCount, setOrgCount] = useState([]); 

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

    useEffect(() => {
        getAnalyticsByOrg();
    }, [orgId, getAnalyticsByOrg]); 

    const [attendeeCount, setAttendeeCount] = useState([]); 

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
        getAnalyticsByEvent();
    }, [orgId]); 

   
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
        </React.Fragment>
    );
};export default Analytics;
