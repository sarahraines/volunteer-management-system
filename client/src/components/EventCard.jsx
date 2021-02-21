import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, message} from 'antd';
import axiosAPI from "../api/axiosApi";
import './EventCard.css';

const { Paragraph } = Typography;

function EventCard ({item}){
	const [register, setRegister] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [viewmore, setViewmore] = useState(false);
	const [attendeeCount, setAttendeeCount] = useState(0);
	
	const onClick = useCallback(async (event_id, register) => {
		setIsLoading(true);
		try {
			if (register) {
				await axiosAPI.post("attendees/delete/", {
					user_id: localStorage.getItem("user_id"),
					event: event_id,
				});
				message.success("Unjoined event")
			} else {
				await axiosAPI.post("attendees/create/", {
					user_id: localStorage.getItem("user_id"),
					event: event_id,
				});
				message.success("Joined event");
			}
			setRegister(!register)
		}
		catch {
			const errMsg = register ? "Join failed" : "Unjoin failed";
			message.error(errMsg);
		}
		setIsLoading(false);
    }, []);

	const getRegisterStatus = useCallback(async () => {
        try {
			console.log("event id");
			console.log(item.id);
            const response = await axiosAPI.get("events/get-register-status/", {
                params: {
					user_id: localStorage.getItem("user_id"),
					event: item.id
                }
            });
			setRegister(false);
			if (response.data == 1) {
				setRegister(true);
			}
        } catch (error) {
            console.error(error);
        }
    }, []);
	
	useEffect(() => {
        getRegisterStatus();
	}, [getRegisterStatus]);
	
	const onClickViewmore = useCallback(async (event_id, viewmore) => {
		setIsLoading(true);
		try {
			const response = await axiosAPI.get("events/get-event-attendee-count/", {
                params: {
					event: item.id
                }
			});
			setAttendeeCount(response.data);
			setViewmore(!viewmore);
		}
		catch {
			const errMsg = "Viewmore failed";
			message.error(errMsg);
		}
		setIsLoading(false);
    }, []);
	
	const buttonText = register ? "Unjoin" : "Join";
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const begindate = new Date(item.begindate)
	const enddate = new Date(item.enddate)
	const virtual = item.virtual ? "Yes." : "No.";

	if (viewmore) {
    	return (
			<Card className="event-card" title={item.name} bordered={true}>
					<Paragraph><b>Location: </b>{item.location}</Paragraph>
					<Paragraph><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</Paragraph>
					<Paragraph><b>Description: </b>{item.description}</Paragraph>
					<Paragraph><b>Virtual? </b>{virtual}</Paragraph>
					<Paragraph><b>Instructions: </b>{item.instructions}</Paragraph>
					<Paragraph><b>No. of Attendees: </b>{attendeeCount}/{item.attendee_cap}</Paragraph>
				<p style={{color: '#1890ff'}}>>><Button type="link" className="event-viewmore-form-button" onClick={() => onClickViewmore(item.id, viewmore)}>
					View Less
				</Button></p>
				<Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.id, register)} loading={isLoading}>
					{buttonText}
				</Button>
				<Paragraph></Paragraph>
			</Card>
		);
	} else {
		return (
			<Card className="event-card" title={item.name} bordered={true}>
					<Paragraph><b>Location: </b>{item.location}</Paragraph>
					<Paragraph><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</Paragraph>
					{/* <Paragraph><b>Causes: </b>
						{item.causes.map(c => 
							<Paragraph key={c.id} level={2}>{c.name}</Paragraph>
						)}
					</Paragraph> */}
					<Paragraph><b>Description: </b>{item.description.substring(0, 50)}...</Paragraph>
				<p style={{color: '#1890ff'}}>>><Button type="link" className="event-viewmore-form-button" onClick={() => onClickViewmore(item.id, viewmore)}>
					View More
				</Button></p>
				<Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.id, register)} loading={isLoading}>
					{buttonText}
				</Button>
				<Paragraph></Paragraph>
			</Card>
		);
	}


} export default EventCard; 

