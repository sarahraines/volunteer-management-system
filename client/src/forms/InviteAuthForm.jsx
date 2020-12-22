import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { registerFromInvite } from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./AuthForm.css"


const InviteAuthForm = ({invite}) => {
    const history = useHistory();

    const onFinish = useCallback(async (values) => {
        try {
            await registerFromInvite(invite.email, values.first_name, values.last_name, values.password, invite.id)
            history.push('/login')
        } catch (error) {
            console.error(error)
        }
    }, [history, invite]);

  return (
    <React.Fragment>
        <Form
            name="auth"
            className="auth-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >  
            <Form.Item>
                <Input.Group compact>
                    <Form.Item
                        name="first_name"
                        noStyle
                        rules={[{ required: true, message: 'First name is required' }]}
                    >
                        <Input style={{ width: '50%' }} placeholder="First name" />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        noStyle
                        rules={[{ required: true, message: 'Last name is required' }]}
                    >
                        <Input style={{ width: '50%' }} placeholder="Last name" />
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            <Form.Item
                name="password"
                hasFeedback
                rules={[
                    { required: true, message: 'Password is a required field.' },
                    { min: 12, message: "Password must be at least 12 characters long."},
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password.' },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                            }
                            return Promise.reject('Passwords do not match.');
                        },
                    }),
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Confirm password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-form-button">
                    Create Account
                </Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default InviteAuthForm;