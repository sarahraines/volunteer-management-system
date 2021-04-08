import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Typography, Carousel, Skeleton, Alert, Space} from 'antd';
import axiosAPI from "../api/axiosApi";

const { Paragraph } = Typography;

function ReportModal ({isModalShowing, onClose}) {
    const [user, setUser] = useState(null);
    const [report, setReport] = useState(null);

    const getUserDetails = useCallback(async () => {
        try {
            const response = await axiosAPI.get("users/get/", {
                 params: {
                     user_id: localStorage.getItem("user_id"),  
                 }
            });
            setUser(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setUser]);

    const getReport = useCallback(async () => {
        try {
            const response = await axiosAPI.get("user/generate-daily-report", {
                params: {
                    user_id: localStorage.getItem('user_id'),
                }
            });
            setReport(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setReport]);

    useEffect(() => {
        getUserDetails();
        getReport();
    }, [getUserDetails, getReport]);

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    if (report?.new_clearances) {
        console.log(report?.new_clearances)
    }
    
	return (
        <Modal
            visible={isModalShowing}
            onCancel={onClose}
            onOk={onClose}
            footer={null}
        >
            <Skeleton active loading={!user} paragraph={{ rows: 1, width: 400 }} title={false}><Typography.Title level={3}>Welcome back, {user?.first_name} 👋</Typography.Title></Skeleton>
            <Typography.Title level={5}>Here's what happened while you were out volunteering:</Typography.Title>
            <Space direction="vertical">
                {report?.events && report?.events?.length > 0 && <Carousel>
                    {report?.events.map(event =>
                        <div key={event.id} >
                            <Alert
                                message="New event details" 
                                description={
                                    <>
                                        <p>Changes were made to <b>{event.name}:</b></p>
                                        <ul>
                                            {event?.old_location && event?.new_location && 
                                                <li><b>New location: </b> {event.new_location}</li>
                                            }
                                            {event?.old_begindate && event?.new_begindate && 
                                                <li><b>New start time: </b> {new Date(event.new_begindate).toLocaleString('en-US', options)}</li>
                                            }
                                            {event?.old_enddate && event?.new_enddate && 
                                                <li><b>New end time: </b> {new Date(event.new_enddate).toLocaleString('en-US', options)}</li>
                                            }
                                        </ul>
                                    </>
                                }          
                                type="info" 
                                showIcon 
                            />
                        </div>
                    )}
                </Carousel>}
                {report?.new_clearances && Object.keys(report.new_clearances).length > 0 && <Carousel>
                    {Object.keys(report.new_clearances).map((k, i) =>
                        (<div key={i} >
                            <Alert
                                message="New clearances" 
                                description={
                                    <>
                                        <p>Clearances were added to the following <b>{report.new_clearances[k][0]['org_name']}</b> events. Time to go fill them out!</p>
                                        <ul>
                                            {report.new_clearances[k].map((event, j) =>
                                                <li key={j}>{event['event_name']}</li>
                                            )}
                                        </ul>
                                    </>
                                }          
                                type="warning" 
                                showIcon 
                            />
                        </div>)
                    )}
                </Carousel>}
                {report?.changed_clearances && Object.keys(report.changed_clearances).length > 0 && <Carousel>
                    {Object.keys(report.changed_clearances).map((k, i) =>
                        (<div key={i} >
                            <Alert
                                message="Clearances reviewed" 
                                description={
                                    <>
                                        <p>Your clearances were reviewed for <b>{report.changed_clearances[k][0]['event_name']}</b>:</p>
                                        {report.changed_clearances[k].map(clearance => clearance.new_status).includes('Rejected') ? 'At least one of your clearances was rejected.' : 'Your clearance(s) were accepted. Check back to see if additional clearances are required.'}
                                    </>
                                }          
                                type={report.changed_clearances[k].map(clearance => clearance.new_status).includes('Rejected') ? 'error' : 'success'} 
                                showIcon 
                            />
                        </div>)
                    )}
                </Carousel>}
                {report?.uploaded_clearances && Object.keys(report.uploaded_clearances).length > 0 && <Carousel>
                    {Object.keys(report.uploaded_clearances).map((k, i) =>
                        (<div key={i} >
                            <Alert
                                message="Review clearances" 
                                description={
                                    <>
                                        <p>{report.uploaded_clearances[k]['uploaded_clearances_count']} new clearances were uploaded to <b>{report.uploaded_clearances[k]['org_name']}</b> events. Time to go review them!</p>
                                    </>
                                }          
                                type="warning" 
                                showIcon 
                            />
                        </div>)
                    )}
                </Carousel>}
                {report?.feedback && report?.feedback?.length > 0 &&
                    <Alert
                        message="Incomplete feedback" 
                        description={
                            <>
                                <p>It's time to give feedback on the following events:</p>
                                <ul>
                                    {report?.feedback.map(event => <li key={event.id}><b>{event.org_name}: </b> {event.event_name}</li>)}
                                </ul>
                            </>
                        }          
                        type="warning" 
                        showIcon 
                    />
                }
            </Space>
        </Modal>
	);

} export default ReportModal; 