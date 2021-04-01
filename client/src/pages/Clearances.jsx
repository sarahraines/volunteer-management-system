import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table, Alert } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import ClearanceUpload from '../components/ClearanceUpload';
const { Title, Text } = Typography;

function Clearances({isAdmin, orgId}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]); 
    const [numIncompleteEvents, setNumIncompleteEvents] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);
    
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
                    e.id = e.events__id;
                    e.name = e.events__name;
                    e.bdate = (new Date(e.events__begindate)).toLocaleString('en-US', options);
                    e.edate = (new Date(e.events__enddate)).toLocaleString('en-US', options);
                })
                
            }

            setEvents(data);
            setFilterDisplay(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }, [setEvents, orgId]);

    const getAlertInfo = useCallback(async () => {
        try {
            let data = {};
            if(isAdmin) {
                // const response = await axiosAPI.get("events/get-by-org/", {
                //     params: {
                //         orgId: orgId,
                //     }
                // });

                // data = response.data;
                data = 0;
                // data.map(e => {
                //     e.bdate = (new Date(e.begindate)).toLocaleString('en-US', options);
                //     e.edate = (new Date(e.enddate)).toLocaleString('en-US', options);
                // });
            } else {
                const response = await axiosAPI.get("attendees/get-num-incomplete-clearances/", {
                    params: {
                        orgId: orgId,
                        user_id: localStorage.getItem("user_id"),
                    }
                });
                // console.log("not admin: " +  response.data[0].events__name);

                data = response.data;
            }

            setNumIncompleteEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }, [setEvents, orgId]);

    useEffect(() => {
        getEventsByOrg();
        getAlertInfo();
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

    const handleChange = e => {
        let oldList = events;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(event =>
                event.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    return (
        <div>
            <Title level={4}>Manage clearances for upcoming events</Title>
            {isAdmin ? 
                <>
                    <Text>Use the "+" button to upload clearances or manage attendee clearances for an 
                        event in the table below.</Text>
                    <Alert
                        message="Pending Clearances to Approve/Reject"
                        description="You have 3 pending clearances that require approval/rejection."
                        type="warning"
                        showIcon
                    />
                </>
                :
                <>
                    <Text>Use the "+" button to view/download blank clearances, upload your completed 
                        clearances, and view the status of your completed clearance for an event in the 
                        table below. Only events you've joined will appear here.</Text>
                    <p></p>
                    <Alert
                        message="Incomplete Clearances Notice"
                        description={"You have incomplete clearances for " + numIncompleteEvents + " upcoming events."}
                        type="warning"
                        showIcon
                    />
                </>
            }
            
            <p></p>
            <input onChange={e => handleChange(e.target.value)} placeholder="Search for events" className="search" style={{ float: 'right' }}/>
            <Table 
                columns={columns}
                dataSource={filterDisplay} 
                loading={loading}
                expandedRowRender= {record => 
                    <ClearanceUpload isAdmin={isAdmin} orgId={orgId} eId={record.id} />
                }
            />
           
        </div>
    );
};

export default Clearances;