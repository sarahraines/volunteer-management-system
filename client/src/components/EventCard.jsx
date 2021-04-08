import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, Image, message, Modal, Form} from 'antd';
import {EditOutlined, DeleteOutlined, ExpandOutlined} from '@ant-design/icons';
import EventLogo from '../assets/undraw_hang_out.svg';
import axiosAPI from "../api/axiosApi";
import EventModal from './EventModal';
import JoinButton from './JoinButton'
import './EventCard.css';
import NewEventForm from '../forms/NewEventForm';

const { Paragraph } = Typography;

function EventCard ({item, isAdmin, removeEvent, updateEvents}){
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
	const [isDeleteDialogOkLoading, setIsDeleteDialogOkLoading] = useState(false);
	const [isEditDialogOkLoading, setIsEditDialogOkLoading] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [causes, setCauses] = useState([]);
	const [form] = Form.useForm();

	const getCausesByEvent = useCallback(async () => {
		try {
			const response = await axiosAPI.get("event/get-causes/", {
				params: {
					eventId: item.id
				}
			});
			setCauses(response.data);
		} catch (error) {
			console.error(error);
		}
    }, [setCauses, item.id]);
	
	useEffect(() => {
		getCausesByEvent();
	}, [getCausesByEvent]);

	const closeModal = useCallback(() => {
        setIsEditModalVisible(false);
    }, []);

    const closeModalWithUpdate = useCallback(() => {
        setIsEditModalVisible(false);
        updateEvents();
		getCausesByEvent();
    }, [updateEvents, getCausesByEvent]);

	const setLoading = useCallback((loadingVal) => {
        setIsEditDialogOkLoading(loadingVal);
    }, []);
	
	const begindate = new Date(item.begindate)
	const enddate = new Date(item.enddate)
	const begindateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const enddateOptions = begindate.getDate() === enddate.getDate() ?  { hour: '2-digit', minute: '2-digit' } : begindateOptions;

	const onClose = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible])

	const date = begindate.toLocaleString('en-US', begindateOptions) + " - " + enddate.toLocaleString('en-US', enddateOptions)

	const onDelete = async (eventId) => {
        try {
            await axiosAPI.delete("event/delete/", {
                params: {
                    id: eventId,
                }
            });
			removeEvent(eventId);
            message.success('Event deleted');
        }
        catch {
            message.error('Event failed to delete');
        }
    }

	return (
		<React.Fragment>
			<Card 
				className="event-card" 
				bordered={true}
				actions={isAdmin ? [
					<EditOutlined key="edit" onClick={() => {setIsEditModalVisible(true)}}/>,
					<DeleteOutlined key="delete" onClick={() => {setIsDeleteDialogVisible(true)}}/>,
					] : []}
				style={{ height: 'auto' }}
				cover={
					<div className="button-container">
						<Image preview={false} alt="img" src={item?.image ?? EventLogo}/>
						<Button className="expand-button" icon={<ExpandOutlined />} ghost onClick={setIsModalVisible}/>
					</div>
				}
			>
				<Card.Meta title={item.name} description={
					<React.Fragment>
						<Paragraph><i>{date}</i></Paragraph>
						{item.attendee_count === item.attendee_cap ?
							<Paragraph><i>No. of Attendees: {item.attendee_count}/{item.attendee_cap} [Closed]</i></Paragraph>
							:
							<Paragraph><i>No. of Attendees: {item.attendee_count}/{item.attendee_cap} </i></Paragraph>
						}
						
						{<JoinButton item={item}/>}
					</React.Fragment>
				} />
			</Card>
			<EventModal event={item} causes={causes} isModalVisible={isModalVisible} onClose={onClose}/>
			<Modal
				title="Delete Event"
				visible={isDeleteDialogVisible}
				onOk={() => {
						setIsDeleteDialogOkLoading(true);
						onDelete(item.id);
						setIsDeleteDialogOkLoading(false);
						setIsDeleteDialogVisible(false);
					}
				}
				onCancel={() => setIsDeleteDialogVisible(false)}
				okText="Delete"
				okButtonProps={{
					loading: isDeleteDialogOkLoading,
					danger: true,
				}}
			>
				<p>{`Are you sure that you want to delete ${item.name}?`}</p>
			</Modal>
			<Modal 
                title="Edit event" 
                visible={isEditModalVisible}
                onCancel={closeModal}
				width={448}
                footer={[
                    <Button key="cancel" onClick={closeModal}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isEditDialogOkLoading} onClick={form.submit} >
                      Update
                    </Button>,
                  ]}
            >
                <NewEventForm form={form} event={item} closeModalWithUpdate={closeModalWithUpdate} setLoading={setLoading}/>
            </Modal>
		</React.Fragment>
	);

} export default EventCard; 

