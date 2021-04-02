import React, {useCallback, useEffect, useState} from 'react';
import {Card, Button, Typography, PageHeader, Tag, Row, Image, Descriptions} from 'antd';
import OrgLogo from '../assets/undraw_team_spirit.svg';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";
import './EventCard.css';
import Modal from 'antd/lib/modal/Modal';
import JoinButton from './JoinButton';
import "./EventModal.css";

const { Paragraph } = Typography;

function OrgModal ({org, causes, onClose, isModalVisible}){

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

    const content = (
        <>
            {org?.email && <Paragraph><b>Email: </b>{org?.email}</Paragraph>}
            {org?.website && <Paragraph><b>Website: </b>{org?.website}</Paragraph>}
            {org?.phone && <Paragraph><b>Phone: </b>{org?.phone}</Paragraph>}
            {org?.address && <Paragraph><b>Address: </b>{org?.address}</Paragraph>}
            {org?.description && <Paragraph><b>Description: </b>{org?.description}</Paragraph>}
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
                title={`${org?.name}`}
                tags={tags}
            >
                <Content
                    extraContent={<Image preview={false} alt="img" src={org?.image ?? OrgLogo} height={300} width={300}/>}
                >
                    {content}
                </Content>
            </PageHeader>
        </Modal>
	);

} export default OrgModal; 

