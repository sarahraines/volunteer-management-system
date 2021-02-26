import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography, Form, Input, Button} from 'antd';
import axiosAPI from '../api/axiosApi';
import { addAlert } from '../actionCreators.js';
import { useDispatch } from 'react-redux';
import { usePageView } from '../utils/googleAnalytics'
import './NewEmail.css';

const { TextArea } = Input;

const { Title } = Typography;

function NewEmail({orgId}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkedList, setCheckedList] = useState([]); 
    const dispatch = useDispatch();

    usePageView('/communication')
    
    const getMembers = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("organization/get-members/", {
                params: {
                    org_id: orgId,
                }
            });
            response.data.forEach(member => member.key = member.id);
            setMembers(response.data);
            setLoading(false);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        if (orgId) {
            getMembers(orgId);
        }
    }, [getMembers, orgId]);

    const onChange = useCallback((_selectedRowKeys, selectedRows) => {
        setCheckedList(selectedRows);
    }, []);

    
    const columns = [
        {
            title: 'First',
            dataIndex: ['user', 'first_name'],
            key: 'first',
            width: '25%',
        },
        {
            title: 'Last',
            dataIndex: ['user', 'last_name'],
            key: 'last',
            width: '25%',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
            width: '25%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                record.member_type === 1 ? "Admin" : "Member"
            ),
            width: '25%',
        },
    ];

    const onFinish = useCallback(async (values) => {
        console.log(checkedList)
        try {
            await axiosAPI.post("member/email/", {
                subject: values.subject,
                body: values.body,
                membersList: checkedList,
            });
            dispatch(addAlert('Email sent', 'success'));
        }
        catch {
            dispatch(addAlert('Email not sent', 'error'));
        }
    }, [dispatch, checkedList]);


    return (
        <React.Fragment>
            <Title level={4}>Email members</Title>

            <Table 
                className = "member-table"
                rowSelection={{ onChange }}
                columns={columns} 
                dataSource={members} 
                loading={loading}/>  

            <Form
                name="org"
                className="org-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}> 

                <Form.Item
                    name="subject"
                    hasFeedback
                    rules={[{ required: true, message: 'Email subject is required.' }]}
                >
                    <Input placeholder="Email subject" />
                </Form.Item>
            
                <Form.Item
                    name="body"
                    hasFeedback
                    rules={[{ required: true, message: 'Email body is required.' }]}>
                        <TextArea row={6} style={{ width: '100%' }} placeholder="Email body here..." />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    Send email
                </Button>
                </Form.Item>

            </Form>
        </React.Fragment>
    );
};


export default NewEmail;
