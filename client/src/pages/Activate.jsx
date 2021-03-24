import React, {useState, useEffect} from 'react';
import { Result, Input, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";
import Form from 'antd/lib/form/Form';

const AuthState = {
    LOADING: 1,
    SUCCESS: 2,
    FAILURE: 3
 };

const Activate = ({userId}) => {

    const [loadingState, setLoadingState] = useState(AuthState.LOADING); 

    useEffect(() => {
        activate();
    }, []);

    const activate = async () => {
        try {
            const queryString = window.location.search;
            const url = `users/activate/${queryString}`;
            await axiosAPI.get(url);
            setLoadingState(AuthState.SUCCESS);
        } catch (error) {
            setLoadingState(AuthState.FAILURE);
        }
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    switch(loadingState) {
        case AuthState.SUCCESS:
            return (
                <Result
                    status="success"
                    title="Successfully activated account"
                    extra={[
                        <Button type="primary" key="login" href="/login">
                            Login
                        </Button>,
                        <Button key="home" href="/" >Return home</Button>,
                    ]}
                />
            );
        case AuthState.FAILURE:
            return (
                <Result
                    status="error"
                    title="Failed to activate account"
                    subTitle="Your activation token may be expired, or otherwise invalid."
                    extra={[
                        <Button key="home" href="/">Return home</Button>,
                    ]}
                />
            );
        default:
            return (
                <Spin indicator={antIcon} />
            );
    }

}

export default Activate;
