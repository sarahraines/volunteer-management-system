import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography, Button, Popconfirm, Tooltip, message, Input } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

const { Title } = Typography;
const { Search } = Input;

function MemberPage({orgId}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDisplay, setFilterDisplay] = useState([]);

    const currentUser = localStorage.getItem("user_id");
    
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
        <React.Fragment>
            <Title level={4}>Members</Title>
            <Search placeholder="search by member name" onChange={e => handleChange(e.target.value)} style={{ width: 300, marginBottom: 16 }}  />
            <Table columns={columns} dataSource={filterDisplay} loading={loading}/>
        </React.Fragment>
    );
};


export default MemberPage;