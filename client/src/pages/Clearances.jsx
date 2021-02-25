import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import ClearanceUpload from '../components/ClearanceUpload';
const { Title } = Typography;

function Clearances({isAdmin, orgId}) {
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
            <Title level={4}>Manage Clearances for Upcoming Events</Title>
            <Table 
                columns={columns}
                dataSource={events} 
                loading={loading}
                expandedRowRender= {record => 
                    <p>
                        <ClearanceUpload isAdmin={isAdmin} orgId={orgId} eId={record.id} />
                    </p>
            }/>
        </React.Fragment>
    );
};
export default Clearances;