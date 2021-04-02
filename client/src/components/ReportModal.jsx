import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Typography, PageHeader, Skeleton} from 'antd';
import EventLogo from '../assets/undraw_hang_out.svg';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";

const { Paragraph } = Typography;

function ReportModal () {
    const [user, setUser] = useState(null);
    const getUserDetails = useCallback(async () => {
        try {
            const response = await axiosAPI.get("users/get/", {
                 params: {
                     user_id: localStorage.getItem("user_id"),  
                 }
            });
            setUser(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setUser]);

    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

	return (
        <Modal
            visible={false}
        >
            <Skeleton active loading={!user} paragraph={{ rows: 1, width: 400 }} title={false}><Typography.Title level={3}>Welcome back, {user?.first_name} 👋</Typography.Title></Skeleton>
        </Modal>
	);

} export default ReportModal; 

// useEffect(() => {
//     axiosAPI.get("user/generate-daily-report", {
//         params: {
//             user_id: localStorage.getItem('user_id'),
//         }
//     });
// }, []);