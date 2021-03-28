import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, Image} from 'antd';
import {EditOutlined, DeleteOutlined, ExpandOutlined} from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";
import EventModal from './EventModal';
import JoinButton from './JoinButton'
import './EventCard.css';

const { Paragraph } = Typography;

function EventCard ({item, isAdmin}){
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [causes, setCauses] = useState([]);

	const getCausesByEvent = useCallback(async () => {
        if (item?.id) {
            try {
                const response = await axiosAPI.get("event/get-causes/", {
                    params: {
                        eventId: item?.id
                    }
                });
                setCauses(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }, [setCauses, item?.id]);
	
	useEffect(() => {
		getCausesByEvent();
	}, [getCausesByEvent]);
	
	const begindate = new Date(item.begindate)
	const enddate = new Date(item.enddate)
	const begindateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const enddateOptions = begindate.getDate() === enddate.getDate() ?  { hour: '2-digit', minute: '2-digit' } : begindateOptions;

	const onClose = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible])

	const date = begindate.toLocaleString('en-US', begindateOptions) + "-" + enddate.toLocaleString('en-US', enddateOptions)

	return (
		<React.Fragment>
			<Card 
				className="event-card" 
				bordered={true}
				actions={isAdmin ? [
					<EditOutlined key="edit" />,
					<DeleteOutlined key="delete" />,
					] : []}
				style={{ height: 'auto' }}
				cover={
					<div className="button-container">
						<Image preview={false} alt="img" src={item.image}/>
						<Button className="expand-button" icon={<ExpandOutlined />} ghost onClick={setIsModalVisible}/>
					</div>
				}
			>
				<Card.Meta title={item.name} description={
					<React.Fragment>
						<Paragraph><i>{date}</i></Paragraph>
						{<JoinButton item={item}/>}
					</React.Fragment>
				} />
				<Paragraph>
				</Paragraph>
			</Card>
			<EventModal event={item} causes={causes} isModalVisible={isModalVisible} onClose={onClose}/>
		</React.Fragment>
	);

} export default EventCard; 

