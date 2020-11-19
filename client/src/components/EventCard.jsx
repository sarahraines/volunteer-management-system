import React, {useCallback, useState, useEffect} from 'react';
import {Card, Button } from 'antd';
import axiosAPI from "../api/axiosApi";
import '../pages/Event.css';

function EventCard ({item}){

	const [register, setRegister] = useState(false); 
	const filter = false;

	useEffect(() => {
     	setRegister(filter);
  	}, [filter])

	const onClick = useCallback(async (event_id, register) => {
		setRegister(!register)

		if (register) {
			await axiosAPI.post("attendees/delete/", {
				user_id: localStorage.getItem("user_id"),
				events: event_id,
	        });
		} else {
			await axiosAPI.post("attendees/create/", {
				user_id: localStorage.getItem("user_id"),
				events: event_id,
	        });
		}

    }, []);

	const buttonText = register ? "Unjoin" : "Join";
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const begindate = new Date(item.begindate)
	const enddate = new Date(item.enddate)

    return (
		<div className='event-container'>
			<Card title={item.name} bordered={true} style={{ width: 500 }}>
                <p><b>Location: </b>{item.location}</p>
                <p><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</p>
                <p><b>Causes: </b>{item.causes}</p>
                <p><b>Description: </b>{item.description}</p>
            <Button type="primary" htmlType="submit" className="event-form-button"
            onClick= {() => onClick(item.id, register)}>
            	{buttonText}
            </Button>
            </Card>
		</div>
	)


} export default EventCard; 

