import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { addAlert } from '../actionCreators.js';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import { useEffect } from 'react';

const { Text } = Typography

const ProfileForm = ({user}) => {
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);
    const [firstName, setFirstName] = useState(user?.first_name);
    const [lastName, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);

    useEffect(() => {
        setFirstName(user?.first_name);
        setLastName(user?.last_name);
        setEmail(user?.email);
     }, [user])


    const onFinish = useCallback(async (values) => {
        if (isEditable) {
            try {
                await axiosAPI.post("users/update/", {
                    user_id: localStorage.getItem('user_id'),
                    first_name: firstName,
                    last_name: lastName,
                    email,
                });
                setIsEditable(false);
                dispatch(addAlert('Profile update success', 'success'));
            } 
            catch {
                dispatch(addAlert('Profile update failed', 'error'));
            }
        }
        else {
            setIsEditable(true);
        }
    }, [isEditable, setIsEditable, dispatch, email, firstName, lastName]);

    const layout = {
        labelCol: { span: 4 },
        labelAlign: 'left'
    }
    
    const textPlaceholder = (fieldName, fieldValue) => (
        <Row style={{ marginBottom: '8px'}}>
            <Col span={4}>
                <Text>{fieldName}:</Text>
            </Col>
            <Col span={20}>
                <Text>{fieldValue}</Text>
            </Col>
        </Row>
    )

    return (
        <React.Fragment>
            <Form
                name="update-profile"
                onFinish={onFinish}
                requiredMark={false}
                initialValues={{
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                  }}
                {...layout}
            > 
                {isEditable ? (
                <Form.Item 
                    label="Name"
                >  
                    <Input.Group compact>
                        <Form.Item
                            name="first_name"
                            noStyle
                            rules={[{ required: true, message: 'First name is required' }]}
                        >
                            <Input style={{ width: '50%' }} placeholder="First name" value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            noStyle
                            rules={[{ required: true, message: 'Last name is required' }]}
                        >
                            <Input style={{ width: '50%' }} placeholder="Last name" value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>) : (
                    textPlaceholder("Name", `${firstName} ${lastName}`)
                )}
                {isEditable ? (
                <Form.Item
                    label="Email"
                    name="email"
                    hasFeedback
                    rules={[
                        { required: true, message: 'Email is a required field.' },
                        { type: 'email', message: 'Not a valid email.' }
                    ]}
                >
                    <Input placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </Form.Item>) : (
                    textPlaceholder("Email", email)
                )}
                {/* {isEditable ? (
                <Form.Item
                    label="Birthdate"
                    name="birthdate"
                    hasFeedback
                    rules={[
                        { required: true, message: 'Birthdate is a required field.' },
                    ]}
                >
                    <DatePicker 
                        onChange={() => {}} 
                        style={{ width: '100%'}}
                    />
                </Form.Item>) : (
                    textPlaceholder("Birthdate", "04/14/1999")
                )} */}
                <Form.Item>
                    <Button.Group style={{ width: '100%' }}>
                        <Button style={{ width: isEditable ? '50%' : '100%', transition: 'none' }} type="primary" htmlType="submit">
                            {isEditable ? "Update" : "Edit"}
                        </Button>
                        <Button style={{ width: '50%', transition: 'none' }} type="secondary" onClick={() => {setIsEditable(false)}} hidden={!isEditable}>
                            Cancel
                        </Button>
                    </Button.Group>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

export default ProfileForm;