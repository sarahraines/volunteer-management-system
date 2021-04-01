import React, {useCallback, useEffect, useState} from 'react';
import { Calendar, Typography , Button, Popover, message} from 'antd';
import axiosAPI from "../api/axiosApi";

const { Paragraph } = Typography;

function VolunteerCalendarCard ({item, isYearView}){
    const [vis, setVisible] = useState([false]); 
    const [isLoading, setIsLoading] = useState(false);
	const [viewmore, setViewmore] = useState(false);
	const [attendeeCount, setAttendeeCount] = useState(0);
    
    const toggleVisible = () => {
        setVisible(!vis);
    };

    const onClick = useCallback(async (event_id) => {
		setIsLoading(true);
		try {
			await axiosAPI.post("attendees/delete/", {
				user_id: localStorage.getItem("user_id"),
				event: event_id,
			});
			message.success("Unjoined event")
		}
		catch {
			const errMsg = "Unjoin failed";
			message.error(errMsg);
		}
		setIsLoading(false);
    }, []);

    const onClickViewmore = useCallback(async (viewmore) => {
		setIsLoading(true);
		try {
			const response = await axiosAPI.get("events/get-event-attendee-count/", {
                params: {
					event: item.events__id
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

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const begindate = new Date(item.events__begindate)
	const enddate = new Date(item.events__enddate)
    const virtual = item.events__virtual ? "Yes." : "No.";
    const time = isYearView ? (new Date(item.events__begindate)).getMonth() + "/" + (new Date(item.events__begindate)).getDate() : (new Date(item.events__begindate)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
    
    if (viewmore) {
    	return (
			<Popover 
                content={
                    <div>
                        <Typography.Title level={4}>{item.events__name} 
                            <a onClick={toggleVisible} style={{ float: "right", color: "grey" }}>
                                X
                            </a>
                        </Typography.Title>
                        <Paragraph><b>Location: </b>{item.events__location}</Paragraph>
                        <Paragraph><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</Paragraph>
                        <Paragraph><b>Description: </b>{item.events__description}</Paragraph>
                        <Paragraph><b>Virtual? </b>{virtual}</Paragraph>
                        <Paragraph><b>Instructions: </b>{item.events__instructions}</Paragraph>
                        <Paragraph><b>No. of Attendees: </b>{attendeeCount}/{item.events__attendee_cap}</Paragraph>
                        <p style={{color: '#1890ff'}}>>><Button type="link" className="event-viewmore-form-button" onClick={() => onClickViewmore(viewmore)}>
                            View Less
                        </Button></p>
                        <Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.events__id)} loading={isLoading}>
                            Unjoin
                        </Button>
                    </div>}
                trigger="click"
                visible={!vis}
                overlayStyle={{
                    width: "40vw",
                    height: "30vw"
                }}
            >
                <Button type="link" className="event-viewmore-form-button" onClick={toggleVisible}>
                {time} {item.events__name}
                </Button>
            </Popover>
		);
	} else {
		return (
			<Popover 
                content={
                    <div>
                        <Typography.Title level={4}>{item.events__name}
                            <a onClick={toggleVisible} style={{ float: "right", color: "grey" }}>
                                X
                            </a>
                        </Typography.Title>
                        <Paragraph><b>Location: </b>{item.events__location}</Paragraph>
                        <Paragraph><b>Date: </b>{begindate.toLocaleString('en-US', options)} - {enddate.toLocaleString('en-US', options)}</Paragraph>
                        <Paragraph><b>Description: </b>{item.events__description.substring(0, 50)}...</Paragraph>
                        <p style={{color: '#1890ff'}}>>><Button type="link" className="event-viewmore-form-button" onClick={() => onClickViewmore(viewmore)}>
                            View More
                        </Button></p>
                        <Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.events__id)} loading={isLoading}>
                            Unjoin
                        </Button>
                    </div>}
                trigger="click"
                visible={!vis}
                overlayStyle={{
                    width: "40vw",
                    height: "30vw"
                }}
            >
                <Button type="link" className="event-viewmore-form-button" onClick={toggleVisible}>
                {time} {item.events__name}
                </Button>
            </Popover>
		);
	}
	


} export default VolunteerCalendarCard; 

