import React from 'react';
import '../pages/Event.css';
import EventCard from './EventCard';


function EventOrganizer ({events, user_events}) {

	const filteredEvents = user_events.filter(user => user.username == localStorage.getItem("user_id"))

	console.log("filteredevents: " + filteredEvents); 

	return (
		events.map((item, i) => 
			<div className='event-container'>
				<EventCard valInArr={i} 
				id={item.id}
				name={item.name}
				location={item.location}
				begindate={item.begindate}
				enddate={item.enddate}
				causes={item.causes}
				description={item.description}
				filter = {(filteredEvents.filter(filteredItem => filteredItem.events[0].id === item.id)).length > 0}
				/>
			</div>
		)
    );
}
export default EventOrganizer; 







