import React, {useCallback, useEffect, useState} from 'react';
import {Button, message} from 'antd';
import axiosAPI from "../api/axiosApi";
import { setOrgs } from '../actionCreators.js';
import { useDispatch } from 'react-redux';

function OrgJoinButton({item}) {
	const [register, setRegister] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	
	const onClick = useCallback(async (register) => {
		setIsLoading(true);
		try {
			if (register) {
				await axiosAPI.delete("member/delete-from-user/", {
					params: {
						user_id: localStorage.getItem("user_id"),
						org_id: item.id,
					},
				});
				message.success("Unjoined organization")
			} else {
				await axiosAPI.post("member/create/", {
					user_id: localStorage.getItem("user_id"),
					org_id: item.id,
					member_type: 0,
					status: 0,
				});
				message.success("Joined organization");
			}
			setRegister(!register)
			const response = await axiosAPI.get("user/get-member/", {
                params: {
                    user_id: localStorage.getItem("user_id"), 
                }
            });
            response.data.forEach(member => member.key = member.organization.id)
            dispatch(setOrgs(response.data));
		}
		catch {
			const errMsg = !register ? "Join failed" : "Unjoin failed";
			message.error(errMsg);
		}
		setIsLoading(false);
    }, [register]);

	const getRegisterStatus = useCallback(async () => {
        try {
            const response = await axiosAPI.get("user/get-member/", {
                params: {
					user_id: localStorage.getItem("user_id"),
                }
            });
			setRegister(false);
			if (response.data.some(org => org?.organization?.id === item.id)) {
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

	return (
		<Button type="primary" htmlType="submit" className="event-form-button" onClick= {() => onClick(register)} loading={isLoading}>
			{buttonText}
		</Button>
	);

} export default OrgJoinButton; 

