import React, {useCallback, useState, useEffect} from 'react';
import {Card, Button, Typography, message} from 'antd';
import axiosAPI from "../api/axiosApi";
import './EventCard.css';

const { Paragraph } = Typography;

function EventCard ({item}){

	const [register, setRegister] = useState(false); 
	const [isLoading, setIsLoading] = useState(false);
	// const filter = false;

	// useEffect(() => {
    //  	setRegister(filter);
  	// }, [filter])

	const onClick = useCallback(async (event_id, register) => {
		setIsLoading(true);
		try {
			if (register) {
				await axiosAPI.post("attendees/delete/", {
					user_id: localStorage.getItem("user_id"),
					events: event_id,
				});
				message.success("Joined event")
			} else {
				await axiosAPI.post("attendees/create/", {
					user_id: localStorage.getItem("user_id"),
					events: event_id,
				});
				message.success("Unjoined event");
			}
			setRegister(!register)
		}
		catch {
			const errMsg = register ? "Join failed" : "Unjoin failed";
			message.error(errMsg);
		}
		setIsLoading(false);
    }, []);

	const buttonText = register ? "Unjoin" : "Join";
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const begindate = new Date(item.begindate)
	const enddate = new Date(item.enddate)

    return (
		<Card className="event-card" title={item.name} bordered={true}>
				<Paragraph><b>Location: </b>{item.location}</Paragraph>
                <Paragraph><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</Paragraph>
                {/* <Paragraph><b>Causes: </b>
					{item.causes.map(c => 
                        <Paragraph key={c.id} level={2}>{c.name}</Paragraph>
                    )}
				</Paragraph> */}
                <Paragraph><b>Description: </b>{item.description}</Paragraph>
            <Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.id, register)} loading={isLoading}>
            	{buttonText}
            </Button>
        </Card>
	)


} export default EventCard; 

