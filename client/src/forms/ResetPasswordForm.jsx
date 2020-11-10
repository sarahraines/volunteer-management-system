import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert, Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { reset_password } from '../api/authenticationApi';
import { addAlert } from '../actionCreators.js';
import "antd/dist/antd.css";
import "./AuthForm.css"

const ResetPasswordForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [isAlertVisible, setIsAlertVisible] = useState(true);

    const onFinish = useCallback(async (values) => {
        try {
            await reset_password(values.old_password, values.new_password);
            dispatch(addAlert('Password reset success', 'success'));
        } catch (error) {
            dispatch(addAlert('Old password incorrect', 'error'));
        }
    }, [dispatch, history]);


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
            </Form.Item>
        </Form>
        {isAlertVisible ? (
            <Alert message="Incorrect password" type="success" closable banner afterClose={setIsAlertVisible(false)} />
        ) : null}
    </React.Fragment>
  );
};

export default ResetPasswordForm;