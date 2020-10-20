import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { reset_password} from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./AuthForm.css"

const ResetPasswordForm = () => {
    const history = useHistory();

    const onFinish = useCallback(async (values) => {
        try {
            await reset_password(values.old_password, values.new_password);
            history.push("/");
        } catch (error) {
            throw error;
        }
    }, [ history]);


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
                    { required: true, message: 'Password is a required field.' },
                ]}
                
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Old Password"
                />
            </Form.Item>
            <Form.Item
                name="new_password"
                hasFeedback
                rules={[
                    { required: true, message: 'Password is a required field.' },
                    [{ min: 12, message: "Password must be at least 12 characters long."}],
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="New Password"
                />
            </Form.Item>
            {/* {isRegister &&
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
            } */}
            <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-form-button">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default ResetPasswordForm;