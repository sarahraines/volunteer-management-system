import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, PageHeader, Tag, Row, Image, Descriptions} from 'antd';
import EventLogo from '../assets/undraw_hang_out.svg';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";
import './EventCard.css';
import Modal from 'antd/lib/modal/Modal';
import JoinButton from './JoinButton';
import "./EventModal.css";

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

    const begindate = new Date(event.begindate)
	const enddate = new Date(event.enddate)
	const begindateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	const enddateOptions = begindate.getDate() === enddate.getDate() ?  { hour: '2-digit', minute: '2-digit' } : begindateOptions;
    const date = begindate.toLocaleString('en-US', begindateOptions) + " - " + enddate.toLocaleString('en-US', enddateOptions)
    const virtual = event.virtual ? "Yes." : "No.";

    const content = (
        <>
            <Paragraph><b>Date: </b>{date}</Paragraph>
            <Paragraph><b>Location: </b>{event.location}</Paragraph>
            <Paragraph><b>No. of Attendees: </b>{event.attendee_count}/{event.attendee_cap}</Paragraph>
            <Paragraph><b>Virtual? </b>{virtual}</Paragraph>
            <Paragraph><b>Description: </b>{event.description}</Paragraph>
            <Paragraph><b>Instructions: </b>{event.instructions}</Paragraph>
        </>
      );

    const Content = ({ children, extraContent }) => (
        <Row>
            <div style={{ marginRight: 24}}>{extraContent}</div>
            <div style={{ flex: 1 }}>{children}</div>
        </Row>
    );

	return (
        <Modal
            visible={isModalVisible}
            footer={null}
            onCancel={onClose}
            width={800}
        >
            <PageHeader
                title={`${event?.name}`}
                tags={tags}
            >
                <Content
                    extraContent={<Image preview={false} alt="img" src={event?.image ?? EventLogo} height={300} width={300}/>}
                >
                    {content}
                </Content>
            </PageHeader>
        </Modal>
	);

} export default EventModal; 

