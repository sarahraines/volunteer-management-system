import React, {useCallback, useEffect, useState} from 'react';
import {Button, message} from 'antd';
import axiosAPI from "../api/axiosApi";

function JoinButton ({item}){
	const [register, setRegister] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	
	const onClick = useCallback(async (event_id, register) => {
		setIsLoading(true);
		try {
			if (register) {
				await axiosAPI.post("attendees/delete/", {
					user_id: localStorage.getItem("user_id"),
					event: event_id,
				});
				item.attendee_count -= 1;
				message.success("Unjoined event")
			} else {
				await axiosAPI.post("attendees/create/", {
					user_id: localStorage.getItem("user_id"),
					event: event_id,
				});
				item.attendee_count += 1;
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
	
	const buttonText = register ? "Unjoin" : "Join";
	const buttonIsDisabled = item.attendee_count >= item.attendee_cap && !register;

	return (
		<Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(item.id, register)} loading={isLoading} disabled={buttonIsDisabled}>
			{buttonText}
		</Button>
	);

} export default JoinButton; 

