import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import { addAlert } from '../actionCreators.js';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import { useEffect } from 'react';

const UserNotificationsForm = ({user}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(user?.email);
    const [text, setText] = useState(user?.text);
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number);

    useEffect(() => {
        setEmail(user?.email);
        setText(user?.text);
        setPhoneNumber(user?.phone_number);
     }, [phoneNumber, user])


    const onFinish = useCallback(async (values) => {
            try {
                await axiosAPI.post("user/submit-notification-settings/", {
                    user_id: localStorage.getItem('user_id'),
                    email,
                    text,
                    phone_number: values.phone_number,
                });
                dispatch(addAlert('Settings update success', 'success'));
            } 
            catch {
                dispatch(addAlert('Settings update failed', 'error'));
            }
    }, [email, text, dispatch]);

    const layout = {
        labelCol: { span: 4 },
        labelAlign: 'left'
    }

    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue({
            email: email,
            text: text,
            phone_number: phoneNumber,
          })
       }, [form, email, text, phoneNumber])

    return (
        <React.Fragment>
            <Form
                form={form}
                name="update-profile"
                onFinish={onFinish}
                initialValues={{
                    email: email,
                    text: text,
                    phone_number: phoneNumber,
                  }}
                {...layout}
            > 
                <Form.Item
                    name="email"
                >
                    <Checkbox checked={email} onChange={(e) => {setEmail(e.target.checked)}}>Send email notifications</Checkbox>
                </Form.Item>
                <Form.Item
                    name="text"
                >
                    <Checkbox checked={text} onChange={(e) => {setText(e.target.checked)}} disabled = {true}>Send text notifications</Checkbox>
                </Form.Item>
                <Form.Item
                    name="phone_number"
                    hasFeedback = {text}
                    rules={[
                        { required: text, message: 'Phone is a required field.' },
                    ]}
                >
                    <Input addonBefore="Phone Number" placeholder="Phone Number" disabled={true}/>
                    {/* <Input addonBefore="Phone Number" placeholder="Phone Number" disabled={!text}/> */}
                </Form.Item>
                <Form.Item>
                        <Button style={{ width: '100%'}} type="primary" htmlType="submit">
                            Update
                        </Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

export default UserNotificationsForm;