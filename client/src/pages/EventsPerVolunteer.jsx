import React, {useState, useEffect} from 'react';
import { Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import Plot from 'react-plotly.js';

const { Title } = Typography;


function EventsPerVolunteer({orgId}) {
    useEffect(() => {
        getUniqueMembers(orgId)
        getUniqueAttendees(orgId)
        getVolunteersWhoGaveFeedback(orgId)
        getAvgEventsPerVolunteer(orgId);
  
    }, [orgId]);
    const [uniqueMembers, setUniqueMembers] = useState(0);
    const [uniqueAttendees, setUniqueAttendees] = useState(0);
    const [uniqueVolunteersWithFeedback, setUniqueVolunteersWithFeedback] = useState(0);
    const [avgEventsPerVolunteer, setAvgEventsPerVolunteer] = useState(0);

    const getUniqueMembers = async (orgId) => {
        try {
            const response =  await axiosAPI.get("organization/get-unique-members/", {
                params: {
                    orgId: orgId,
                }
            });
            setUniqueMembers(response.data[0])
        } catch(error) {
            console.error(error);
        }
    }
    const getUniqueAttendees = async (orgId) => {
        try {
            const response =  await axiosAPI.get("events/get-unique-attendees/", {
                params: {
                    orgId: orgId,
                }
            });
            setUniqueAttendees(response.data)
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
            setAvgEventsPerVolunteer(response.data)
        } catch(error) {
            console.error(error);
        }
    }
    var data = [{type: 'funnel', y: ["Members", "Attendees", "Feedback", "Events per Volunteer"], x: [uniqueMembers, uniqueAttendees, uniqueVolunteersWithFeedback, avgEventsPerVolunteer]}];
    var layout = {margin: {l: 150}, width:600, height: 500}
    return (
        <Plot data={data} layout={layout}/>
    );
};
export default EventsPerVolunteer;