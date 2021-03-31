import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import ClearanceUpload from '../components/ClearanceUpload';
const { Title, Text } = Typography;

function Clearances({isAdmin, orgId}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]); 

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const getEventsByOrg = useCallback(async () => {
        try {
            let data = {};
            if(isAdmin) {
                const response = await axiosAPI.get("events/get-by-org/", {
                    params: {
                        orgId: orgId,
                    }
                });

                data = response.data;
                data.map(e => {
                    e.bdate = (new Date(e.begindate)).toLocaleString('en-US', options);
                    e.edate = (new Date(e.enddate)).toLocaleString('en-US', options);
                });
            } else {
                const response = await axiosAPI.get("attendees/get-volunteer-events-for-org/", {
                    params: {
                        orgId: orgId,
                        user_id: localStorage.getItem("user_id"),
                    }
                });
                // console.log("not admin: " +  response.data[0].events__name);

                data = response.data;
                data.map(e => {
                    e.name = e.events__name;
                    e.bdate = (new Date(e.events__begindate)).toLocaleString('en-US', options);
                    e.edate = (new Date(e.events__enddate)).toLocaleString('en-US', options);
                })
                
            }

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

    return (
        <div>
            <Title level={4}>Manage clearances for upcoming events</Title>
            {isAdmin ? 
                <>
                    <Text>Use the "+" button to upload clearances or manage attendee clearances for an 
                        event in the table below.</Text>
                    <Table 
                        columns={columns}
                        dataSource={events} 
                        loading={loading}
                        expandedRowRender= {record => 
                            <ClearanceUpload isAdmin={isAdmin} orgId={orgId} eId={record.id} />
                        }
                    />
                </> :
                // <UserFilesTable orgId={orgId} fileList={fileList} />
                <>
                    <Text>Use the "+" button to view/download blank clearances, upload your completed 
                        clearances, and view the status of your completed clearance for an event in the 
                        table below. Only events you've joined will appear here.</Text>
                    <Table 
                        columns={columns}
                        dataSource={events} 
                        loading={loading}
                        expandedRowRender= {record => 
                            <ClearanceUpload isAdmin={isAdmin} orgId={orgId} eId={record.events__id} />
                        }
                    />
                </>
            }
           
        </div>

        // <React.Fragment>
            
            
                    // {/* <Upload {...orgProps}>
                    //     <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    // </Upload> */}
        // </React.Fragment>
    );
};

export default Clearances;