import React, {useState, useEffect, useCallback} from 'react';
import { Result, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import InviteAuth from '../pages/InviteAuth';

const AuthState = {
    LOADING: 1,
    NEW_USER: 2,
    RETURNING_USER: 3,
    FAILURE: 4
 };

const InviteNoAuth = () => {

    const [loadingState, setLoadingState] = useState(AuthState.LOADING); 
    const [user, setUser] = useState(null);
    const [invite, setInvite] = useState(null);

    useEffect(() => {
        validate();
    }, []);

    const validate = useCallback(async () => {
        try {
            const queryString = window.location.search;
            const params = queryString.split(/[?&=]/);
            var token = "";
            for (var i = 0; i < params.length - 1; i++) {
                if (params[i] === "rt") {
                    token = params[i+1];
                    break;
                }
            }
            if (token !== "") {
                const url = `invite/validate/${queryString}`;
                const response = await axiosAPI.get(url);
                if (response.status === 200) {
                    console.log(response.data.user)
                    if (response.data.user.email !== "") {
                        setLoadingState(AuthState.RETURNING_USER);
                        setUser(response.data.user)
                    } else {
                        setLoadingState(AuthState.NEW_USER);
                    }
                    setInvite(response.data.invite)
                } else {
                    setLoadingState(AuthState.FAILURE);
                }
            }
            else {
                setLoadingState(AuthState.FAILURE);
            }
        } catch (error) {
            setLoadingState(AuthState.FAILURE);
        }
    }, [setLoadingState])

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    switch(loadingState) {
        case AuthState.FAILURE:
            return (
                <Result
                    status="error"
                    title="Failed to join organization"
                    subTitle="Your invitation token may be expired, or otherwise invalid. Contact the group administrator to receive another invitation."
                    extra={[
                        <Button key="home" href="/">Return home</Button>,
                    ]}
                />
            );
        case AuthState.LOADING:
            return (
                <Spin indicator={antIcon} />
            );
        default:
            return (
                <InviteAuth isRegister={loadingState === AuthState.NEW_USER} invite={invite} user={user}/>
            );
    }

}

export default InviteNoAuth;
