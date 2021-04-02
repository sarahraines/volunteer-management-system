import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { forgot_password } from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./AuthForm.css"

const ForgotPasswordForm = ({isRegister}) => {

    const onFinish = useCallback(async (values) => {
        try {
            await forgot_password(values.email);
         
        } catch (error) {
            throw error;
        }
    }, []);


  return (
    <React.Fragment>
        <Form
            name="forgot-password"
            className="forgot-password-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >   
            <Form.Item
                name="email"
                hasFeedback
                rules={[
                    { required: true, message: 'Email is a required field.' },
                    { type: 'email', message: 'Not a valid email.' }
                ]}
            >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
           
            <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-form-button">
                    {"Submit"}
                </Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default ForgotPasswordForm;