import { Layout, Typography } from 'antd';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import RegisterLogo from '../assets/register.svg';
import './Auth.css';
import React, {useState, useEffect, useCallback} from 'react';
import { Result, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";

const AuthState = {
    LOADING: 1,
    SUCCESS: 2,
    FAILURE: 3,
 };

 const ResetPassword = () => {
    const [loadingState, setLoadingState] = useState(AuthState.LOADING); 

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
                const url = `users/validate-reset-password/${queryString}`;
                const response = await axiosAPI.get(url);
                if (response.status === 200) {
                    setLoadingState(AuthState.SUCCESS);
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

    useEffect(() => {
        validate();
    }, [validate]);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    switch(loadingState) {
        case AuthState.FAILURE:
            return (
                <Result
                    status="error"
                    title="Failed to reset password"
                    subTitle="Your password token may be expired, or otherwise invalid. Please try again to reset your password."
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
                <Layout style={{ height: "100vh" }}>
                    <Layout.Content className="auth-content">
                        <div className='auth-container'>
                            <Typography.Title level={2}>Reset Password</Typography.Title>
                            <img 
                                className="auth-logo"
                                src={RegisterLogo} 
                                alt={"reset password logo"}
                            />
                            <ResetPasswordForm isAuthenticated={false}/>
                        </div>
                    </Layout.Content>
                </Layout>
              );
    }

}

export default ResetPassword;