import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography, Button, Popconfirm, Tooltip, message } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

const { Title } = Typography;

function MemberPage({orgId}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = localStorage.getItem("user_id");
    console.log(members)

    const getMembers = async (orgId) => {
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
    }

    const deleteMember = useCallback(async (memberId) => {
        try {
            const response =  await axiosAPI.delete("member/delete/", {
                params: {
                    member_id: memberId,
                }
            });
            setMembers(members.filter(member => member.key !== memberId));
            message.success("Member deleted");
        } catch(error) {
            console.error(error);
            message.error("Member could not be deleted.");
        }
    }, [members]);

    useEffect(() => {
        if (orgId) {
            getMembers(orgId);
        }
    }, [orgId]);

    const columns = [
        {
            title: 'First',
            dataIndex: ['user', 'first_name'],
            key: 'first',
        },
        {
            title: 'Last',
            dataIndex: ['user', 'last_name'],
            key: 'last',
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
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                "Active"
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                parseInt(currentUser) === record.user.id ?
                (
                    <Tooltip title="Cannot delete your own user.">
                        <Button type="primary" danger disabled>
                            Delete
                        </Button>
                    </Tooltip>
                ) : (
                    <Popconfirm title="Are you sure you want to delete this member?" onConfirm={() => deleteMember(record.key)} okText="Yes" cancelText="No" disabled={parseInt(currentUser) === record.user.id}>
                        <Button type="primary" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                )
            )
        }
    ];

    return (
        <div>
            <Title level={4}>Members</Title>
            <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Download
            </Button>
            <Table columns={columns} dataSource={members} loading={loading}/>
        </div>
    );
};


export default MemberPage;