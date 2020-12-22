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
            if (isRegister) {
                await register(values.email, values.first_name, values.last_name, values.password)
            } else {
                await login(values.email, values.password);
                history.push("/");
            }
        } catch (error) {
            console.error(error)
        }
    }, [isRegister, history]);

    const submitButtonText = isRegister ? "Create account" : "Log in";
    const switchAuthPages = isRegister ? (
        <React.Fragment>
            Already have an account? <Link to="/login">Log in</Link>
        </React.Fragment>
    ) : (
        <React.Fragment>
            New user? <Link to="/register">Create account</Link>
        </React.Fragment> 
    );

  return (
    <React.Fragment>
        <Form
            name="auth"
            className="auth-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >   {isRegister &&
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
            }
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
            <Form.Item
                name="password"
                hasFeedback={isRegister}
                rules={[
                    { required: true, message: 'Password is a required field.' },
                    ...isRegister ? [{ min: 12, message: "Password must be at least 12 characters long."}] : [],
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            {isRegister &&
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
            }
            <Form.Item>
                <Button type="primary" htmlType="submit" className="auth-form-button">
                    {submitButtonText}
                </Button>
                {switchAuthPages}
                {!isRegister && <Link className="auth-form-forgot" to="/register">Forgot password?</Link>}
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default AuthForm;