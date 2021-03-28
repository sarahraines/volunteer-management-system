import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, PageHeader, Tag} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";
import './EventCard.css';
import Modal from 'antd/lib/modal/Modal';
import JoinButton from './JoinButton';

const { Paragraph } = Typography;

function EventModal ({event, causes, onClose, isModalVisible}){

    const tags = (
        <React.Fragment>
            {causes.map(cause => 
                <Tag 
                    key={cause.id} 
                    color="blue" 
                >
                    {cause.name}
                </Tag>
            )}
        </React.Fragment>
    );

	return (
        <Modal
            visible={isModalVisible}
            footer={null}
            onCancel={onClose}
            width={'75em'}
        >
            <PageHeader
                title={`${event?.name}`}
                tags={tags}
                extra={<JoinButton item={event}/>}
            ></PageHeader>
        </Modal>
	);

} export default EventModal; 

