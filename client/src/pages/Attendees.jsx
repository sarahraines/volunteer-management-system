import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

const { Title } = Typography;

function Attendees({orgId}) {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getAttendees = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("event/get-attendees/", {
                params: {
                    org_id: orgId,
                }
            });
            setAttendees(response.data);
            setLoading(false);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getAttendees();
    }, [getAttendees]);

    const columns = [
        {
            title: 'Upcoming Event',
            dataIndex: 'events__name',
            key: 'events__name',
        },
        {
            title: 'Attendees',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Cap',
            dataIndex: 'events__attendee_cap',
            key: 'events__attendee_cap',
        },
    ];
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Title level={4}>Attendees</Title>
            <Table 
                columns={columns}
                dataSource={attendees} 
                loading={loading}
                expandedRowRender= {record => 
                    <p>
                        <b>Event Details</b><br/>
                        Name: {record.events__name}<br/>
                        Location: {record.events__location}<br/>
                        Date: {(new Date(record.events__begindate)).toLocaleString('en-US', options)} - {(new Date(record.events__enddate)).toLocaleString('en-US', options)}<br/><br/>
                        
                        <b>Attendees: </b>
                        {record.attendees}
                    </p>
            }/>
        </React.Fragment>
    );
};


export default Attendees;