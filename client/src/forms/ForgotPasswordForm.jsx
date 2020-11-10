import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { register, login } from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./AuthForm.css"

const AuthForm = ({isRegister}) => {
    const history = useHistory();

    const onFinish = useCallback(async (values) => {
        try {
            await forgot_password(values.email);
         
        } catch (error) {
            throw error;
        }
    }, [isRegister, history]);


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