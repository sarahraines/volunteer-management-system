import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { register, login } from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./AuthForm.css"

const EventForm = ({isRegister}) => {
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
            throw error;
        }
    }, [isRegister, history]);

    const submitButtonText = isRegister ? "Create account" : "Log in";
    const switchAuthPages = 
        <React.Fragment>
            Already have an account? <Link to="/create-organization">Log in</Link>
        </React.Fragment>;

  return (
    <React.Fragment>
        <Form
            name="event"
            className="auth-form"
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
                    {submitButtonText}
                </Button>
                {switchAuthPages}
                {!isRegister && <Link className="auth-form-forgot" to="/create-organization">Forgot password?</Link>}
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default EventForm;