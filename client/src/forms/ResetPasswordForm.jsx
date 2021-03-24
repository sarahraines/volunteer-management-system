import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { reset_password } from '../api/authenticationApi';
import { addAlert } from '../actionCreators.js';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import "./AuthForm.css"

const ResetPasswordForm = () => {
    const dispatch = useDispatch();

    const onFinish = useCallback(async (values) => {
        try {
            await reset_password(values.old_password, values.new_password);
            dispatch(addAlert('Password reset success', 'success'));
        } catch (error) {
            dispatch(addAlert('Old password incorrect', 'error'));
        }
    }, [dispatch]);

    const sendForgotPasswordEmail = useCallback(async () => {
        try {
            const url = "users/forgot-password-link/?user_id=" + localStorage.getItem("user_id")
            await axiosAPI.get(url);
            dispatch(addAlert('Password reset link sent to email', 'success'));
        } catch (error) {
            dispatch(addAlert('Password reset email failed to send', 'error'));
        }
    }, [dispatch]);

  return (
    <React.Fragment>
        <Form
            name="reset-password"
            className="reset-password-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        > 
            <Form.Item
                name="old_password"
                hasFeedback
                rules={[
                    { required: true, message: 'Old password is a required field.' },
                ]}
                
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Old password"
                />
            </Form.Item>
            <Form.Item
                name="new_password"
                hasFeedback
                rules={[
                    { required: true, message: 'New password is a required field.' },
                    { min: 12, message: "Password must be at least 12 characters long."}
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="New password"
                />
            </Form.Item>
            <Form.Item
                    name="confirm"
                    dependencies={['new_password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your new password.' },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('new_password') === value) {
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
                    Submit
                </Button>
                Forgot password? 
                <Button type="link" style={{ paddingLeft: 4, paddingRight: 4}} onClick={sendForgotPasswordEmail}>
                    Send a password reset email
                </Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default ResetPasswordForm;