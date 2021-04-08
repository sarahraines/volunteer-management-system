import React, {useState, useEffect, useCallback} from 'react';
import { Table, Typography, Button, Popconfirm, message, Row, Modal, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

const { Title } = Typography;
const { Option } = Select;

function InvitePage({orgId}) {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalButtonLoading, setModalButtonLoading] = useState(false);
    const [invitedMembers, setInvitedMembers] = useState([]);
    const [memberType, setMemberType] = useState(0);
    

    const getInvites = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("organization/get-invites/", {
                params: {
                    org_id: orgId,
                }
            });
            response.data.forEach(invite => invite.key = invite.id);
            setInvites(response.data);
            setLoading(false);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    const inviteMembers = useCallback(async () => {
        try {
            setModalButtonLoading(true);
            await axiosAPI.post("member/invite/", {
                emails: invitedMembers,
                member_type: memberType,
                org_id: orgId,
            });
            setInvitedMembers([]);
            getInvites();
            message.success("Invitation sent");
        } catch(error) {
            console.error(error);
            message.error("Invitations could not be sent.");
        }
        setModalButtonLoading(false);
    }, [invitedMembers, getInvites, setInvitedMembers, memberType, orgId, setModalButtonLoading]);

    const deleteInvite = useCallback(async (inviteId) => {
        try {
            await axiosAPI.delete("invite/delete/", {
                params: {
                    invite_id: inviteId,
                }
            });
            setInvites(invites.filter(invite => invite.key !== inviteId));
            message.success("Invitation deleted");
        } catch(error) {
            console.error(error);
            message.error("Invitation could not be deleted");
        }
    }, [invites]);
    
    const resendEmail = useCallback(async (inviteId) => {
        try {
            await axiosAPI.get("invite/resend/", {
                params: {
                    invite_id: inviteId,
                }
            });
            message.success("Invitation successfully resent");
        } catch(error) {
            console.error(error);
            message.error("Invitation could not be resent");
        }
    }, []);

    useEffect(() => {
        if (orgId) {
            getInvites(orgId);
        }
    }, [getInvites, orgId]);

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
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
            title: 'Resend',
            key: 'resend',
            render: (_, record) => (
                <Popconfirm title="Are you sure you want to resend an invitation to this member?" onConfirm={() => resendEmail(record.key)} okText="Yes" cancelText="No">
                    <Button type="primary">
                        Resend
                    </Button>
                </Popconfirm>
            )
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) => (
                <Popconfirm title="Are you sure you want to delete this invitation?" onConfirm={() => deleteInvite(record.key)} okText="Yes" cancelText="No">
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <React.Fragment>
            <div>
                <Row justify="space-between">
                    <Title level={4}>Outstanding invites</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
                        Invite new members
                    </Button>
                </Row>
                <Table columns={columns} dataSource={invites} loading={loading}/>
            </div>
            <Modal
                visible={showModal}
                title="Invite new members"
                onOk={() => {}}
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button key="back" onClick={() => setShowModal(false)}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" loading={modalButtonLoading} onClick={inviteMembers}>
                        Send
                    </Button>,
                ]}
            >
                <Select title="hello:" defaultValue={0} style={{ width: '100%', marginBottom: 8 }} onChange={setMemberType} placeholder="Member Type">
                    <Option value={0}>Member</Option>
                    <Option value={1}>Admin</Option>
                </Select>
                <Select mode="tags" style={{ width: '100%' }} onChange={value => setInvitedMembers(value)} tokenSeparators={[',']} placeholder="Emails" allowClear>
                    {[]}
                </Select>
            </Modal>
        </React.Fragment>
    );
};


export default InvitePage;