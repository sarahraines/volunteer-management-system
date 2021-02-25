import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import OrgClearanceTable from './OrgClearanceTable';
const { Title } = Typography;

function ManageVolunteerClearances({orgId}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]); 

    const getEventsByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("events/get-by-org/", {
                params: {
                    orgId: orgId,
                }
            });

            const data = response.data;
            data.map(e => {
                e.bdate = (new Date(e.begindate)).toLocaleString('en-US', options);
                e.edate = (new Date(e.enddate)).toLocaleString('en-US', options);
            });

            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }, [setEvents, orgId]);

    useEffect(() => {
        getEventsByOrg();
    }, [orgId, getEventsByOrg]);

    const columns = [
        {
            title: 'Event',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'bdate',
            key: 'bdate',
        },
        {
            title: 'End Date',
            dataIndex: 'edate',
            key: 'edate',
        }
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };


    return (
        <React.Fragment>
            <Title level={4}>Manage Volunteers' Uploaded Clearance for Each Event</Title>
            <Table 
                columns={columns}
                dataSource={events} 
                loading={loading}
                expandedRowRender= {record => 
                    <p>
                        <OrgClearanceTable orgId={orgId} eId={record.id} />
                    </p>
            }/>
        </React.Fragment>
    );
};
export default ManageVolunteerClearances;