import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography, Form, Input, Button } from 'antd';
import axiosAPI from '../api/axiosApi';
import { addAlert } from '../actionCreators.js';
import { useDispatch } from 'react-redux';
import './NewEmail.css';

const { TextArea } = Input;
const { Search } = Input;

const { Title } = Typography;

function NewEmail({orgId}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkedList, setCheckedList] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);
    const dispatch = useDispatch();

    const getMembers = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("organization/get-members/", {
                params: {
                    org_id: orgId,
                }
            });
            response.data.forEach(member => member.key = member.id);
            setFilterDisplay(response.data); 
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

    const handleChange = e => {
        let oldList = members;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(member =>
                member.user.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: ['user', 'name'],
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                record.member_type === 1 ? "Admin" : "Member"
            ),
        },
    ];

    const onFinish = useCallback(async (values) => {
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
            <Search placeholder="search by volunteer name" onChange={e => handleChange(e.target.value)} style={{ width: 300, marginBottom: 16 }}  />
            <Table 
                className = "member-table"
                rowSelection={{ onChange }}
                columns={columns} 
                dataSource={filterDisplay} 
                loading={loading}
                pagination={{ pageSize: 5 }}/>  

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
