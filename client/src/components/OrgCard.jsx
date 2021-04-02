import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Image} from 'antd';
import {ExpandOutlined} from '@ant-design/icons';
import OrgLogo from '../assets/undraw_team_spirit.svg';
import axiosAPI from "../api/axiosApi";
import OrgModal from './OrgModal';
import OrgJoinButton from './OrgJoinButton'
import './EventCard.css';

function OrgCard ({organization, selectedCauses}){
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [causes, setCauses] = useState([]);
	const getCausesByOrg = useCallback(async () => {
		try {
			const response = await axiosAPI.get("organization/get-causes/", {
				params: {
					orgId: organization?.id
				}
			});
			setCauses(response.data);
		} catch (error) {
			console.error(error);
		}
    }, [setCauses, organization.id]);
	
	useEffect(() => {
		getCausesByOrg();
	}, [getCausesByOrg]);

	const onClose = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible])

	const causeIntersection = causes.map(cause => cause.id).filter(cause => selectedCauses.includes(cause));
	const hideCard = selectedCauses.length > 0 && causes.length > 0 && causeIntersection.length === 0;

	return (
		<React.Fragment>
			<Card 
				className="event-card" 
				bordered={true}
				style={{ height: 'auto' }}
				cover={
					<div className="button-container">
						<div className="image-container">
							<Image className="image" preview={false} alt="img" src={organization?.image ?? OrgLogo} />
							<Button className="expand-button" icon={<ExpandOutlined />} ghost onClick={setIsModalVisible}/>
						</div>
					</div>
				}
				hidden={hideCard}
			>
				<Card.Meta title={organization?.name} description={
					<React.Fragment>
						{<OrgJoinButton item={organization}/>}
					</React.Fragment>
				} />
			</Card>
			<OrgModal org={organization} causes={causes} isModalVisible={isModalVisible} onClose={onClose}/>
		</React.Fragment>
	);

} export default OrgCard; 

