import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import Plot from 'react-plotly.js';

const { Title } = Typography;


function EventsPerVolunteer({orgId}) {
    useEffect(() => {
        getEvents(orgId)
        getUniqueAttendees(orgId)
        getUniqueMembers(orgId)
        getVolunteersWhoGaveFeedback(orgId)
        getAvgEventsPerVolunteer(orgId);
  
    }, [orgId]);
    const [uniqueAttendees, setUniqueAttendees] = useState(0);
    const [uniqueMembers, setUniqueMembers] = useState(0);
    const [uniqueEvents, setUniqueEvents] = useState(0);
    const [uniqueVolunteersWithFeedback, setUniqueVolunteersWithFeedback] = useState(0);
    const [avgEventsPerVolunteer, setAvgEventsPerVolunteer] = useState(0);

    const getUniqueAttendees = async (orgId) => {
        try {
            const response =  await axiosAPI.get("events/get-unique-attendees/", {
                params: {
                    orgId: orgId,
                }
            });
            console.log("unique attendees" + response.data);
            setUniqueAttendees(response.data)
        } catch(error) {
            console.error(error);
        }
    }
    const getUniqueMembers = async (orgId) => {
        try {
            const response =  await axiosAPI.get("organization/get-member-counts-by-org/", {
                params: {
                    orgId: orgId,
                }
            });
            console.log("unique members" + response.data[0]);
            setUniqueMembers(response.data[0])
        } catch(error) {
            console.error(error);
        }
    }
    const getEvents = async (orgId) => {
        try {
            const response =  await axiosAPI.get("events/count-for-org/", {
                params: {
                    orgId: orgId,
                }
            });
            console.log("event count" + response.data);
            setUniqueEvents(response.data)
        } catch(error) {
            console.error(error);
        }
    }
    const getVolunteersWhoGaveFeedback = async (orgId) => {
        try {
            const response =  await axiosAPI.get("events/get-unique-volunteers-with-feedback/", {
                params: {
                    orgId: orgId,
                }
            });
            console.log("volunteers with feeback" + response.data);
            setUniqueVolunteersWithFeedback(response.data)
        } catch(error) {
            console.error(error);
        }
    }
    const getAvgEventsPerVolunteer = async (orgId) => {
        try {
            const response =  await axiosAPI.get("events/get-avg-events-per-volunteer/", {
                params: {
                    orgId: orgId,
                }
            });
            console.log("events per volunteer" + response.data);
            setAvgEventsPerVolunteer(response.data)
        } catch(error) {
            console.error(error);
        }
    }
    console.log("unique attendees" + uniqueAttendees);
    console.log("unique vol" + uniqueVolunteersWithFeedback);
    var data = [{type: 'funnel', y: ["Members", "Attendees", "Feedback", "Events per Volunteer"], x: [uniqueMembers, uniqueAttendees, uniqueVolunteersWithFeedback, avgEventsPerVolunteer]}];
    var layout = {margin: {l: 150}, width:600, height: 500}
    return (
        <Plot data={data} layout={layout}/>
    );
};
export default EventsPerVolunteer;