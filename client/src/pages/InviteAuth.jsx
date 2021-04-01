import React, { useCallback } from 'react';
import { Layout, Typography, Button, Space, Skeleton } from 'antd';
import InviteAuthForm from '../forms/InviteAuthForm';
import { useHistory } from 'react-router-dom';
import LoginLogo from '../assets/login.svg';
import RegisterLogo from '../assets/register.svg';
import axiosAPI from '../api/axiosApi';
import './Auth.css';

const InviteAuth = ({isRegister, invite, user}) => {
    const title = `Join ${invite?.organization?.name ?? "Organization"}`;
    const info = `${isRegister ? "Welcome!" : "Hey there!"} You've been invited to join ${invite?.organization?.name ?? "a new organization"} on VolunteerSense.
    ${isRegister ? "Get started my making an account." : "Do you want to join this organization?"}`;
    const history = useHistory();
    const logo = isRegister ? RegisterLogo: LoginLogo;

    const acceptInvite = useCallback(async () => {
        try {
            const response = await axiosAPI.get("invite/accept/", {
                params: {
                    rt: new URLSearchParams(window.location.search).get('rt'),
                }

            });
            history.push("/login")
        } catch (error) {
            console.error(error);
        }
    }, [user, invite]);

    const declineInvite = useCallback(async () => {
        try {
            const response = await axiosAPI.get("invite/reject/", {
                params: {
                    invite_id: invite.id,
                }
            });
            history.push("/login")
        } catch (error) {
            console.error(error);
        }
    }, [user, invite]);

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="auth-content">
                <div className='auth-container'>
                    <Skeleton active loading={!invite} paragraph={false}>
                        <Typography.Title level={2}>{title}</Typography.Title>
                    </Skeleton>
                    <Skeleton active loading={!invite} title={false}>
                        <Typography.Paragraph level={2}>{info}</Typography.Paragraph>
                    </Skeleton>
                    <img 
                        className="auth-logo"
                        src={logo} 
                        alt={title + " logo"}
                    />
                    {isRegister ? 
                        (
                            <InviteAuthForm invite={invite}/>
                        ) :
                        (
                            <Space style={{ width: '100%'}}>
                                <Button style={{ width: 196 }} type="primary" onClick={acceptInvite}>Join</Button>
                                <Button style={{ width: 196 }} type="primary" danger onClick={declineInvite}>Decline Invitation</Button>
                            </Space>
                        )
                    }
                </div>
            </Layout.Content>
        </Layout>
    );
};


export default InviteAuth;