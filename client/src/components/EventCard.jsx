import React, {useCallback, useState, useEffect} from 'react';
import {Card, Button } from 'antd';
import axiosAPI from "../api/axiosApi";
import '../pages/Event.css';

function EventCard ({valInArr, id, name, location, begindate, enddate, causes, description, filter}){

	//setState hook onClick, on initial useState hook = filter value

	const filterValue = filter;

	const [register, setRegister] = useState(filterValue); 

	useEffect(() => {
     	setRegister(filter);
  	}, [filter])

	const onClick = useCallback(async (event_id, register) => {
		setRegister(!register)

		if(register){
			const response = await axiosAPI.post("attendees/delete/", {
	        user_id: localStorage.getItem("user_id"),
	        events: event_id,
	        });
		} else{
			const response = await axiosAPI.post("attendees/create/", {
	        user_id: localStorage.getItem("user_id"),
	        events: event_id,
	        });
		}

    }, []);

    const buttonText = register ? "Unjoin" : "Join"

    console.log("filter:", filter);
	console.log("register:", register);

    return (
		<div className='event-container'>
			<Card title={name} bordered={true} style={{ width: 500 }}>
                <p><b>Location: </b>{location}</p>
                <p><b>Date: </b>{begindate}-{enddate}</p>
                <p><b>Causes: </b>{causes}</p>
                <p><b>Description: </b>{description}</p>
            <Button type="primary" htmlType="submit" className="event-form-button"
            onClick= {() => onClick(id, register)}>
            	{buttonText}
            </Button>
            </Card>
		</div>
	)


} export default EventCard; 

