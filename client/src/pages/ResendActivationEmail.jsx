import React from 'react';
import { Layout, Form, Typography, Input, Button} from 'antd';
import RegisterLogo from '../assets/register.svg';
import {resendConfirmation} from "../api/authenticationApi";
import './Auth.css';

const ResendActivationEmail = () => {
  const logo = RegisterLogo;
    const resendEmail = async (email) => {
        await resendConfirmation(email);
    }
  return (
    <Layout style={{ height: "100vh" }}>
        <Layout.Content className="auth-content">
            <div className='auth-container'>
                <Typography.Title level={2}>Resend Activation Email</Typography.Title>
                <img 
                    className="auth-logo"
                    src={logo} 
                    alt={"Resend Activation Email logo"}
                />
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={resendEmail}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your email!',
                            },
                        ]}>
                        <Input/>
                    </Form.Item> 
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Resend confirmation email
                        </Button>,
                    </Form.Item>
                </Form>
            </div>
        </Layout.Content>
    </Layout>
  );
};


export default ResendActivationEmail;








