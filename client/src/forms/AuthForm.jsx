import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import axios from 'axios';
import "antd/dist/antd.css";
import "./AuthForm.css"

const AuthForm = ({isRegister}) => {
  const onFinish = values => {
    // axios.post(`https://jsonplaceholder.typicode.com/users`)
    // .then(res => {
    //   const persons = res.data;
    //   this.setState({ persons });
    // })
  };

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
        >
        <Form.Item
            name="email"
            hasFeedback
            rules={[
                { required: true, message: 'Email is a required field.' },
                { type: 'email', message: 'Not a valid email.' }
            ]}
        >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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
        {!isRegister &&
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link className="auth-form-forgot" to="/register">Forgot password</Link>
            </Form.Item>
        }
        <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-form-button">
            {submitButtonText}
            </Button>
            {switchAuthPages}
        </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default AuthForm;