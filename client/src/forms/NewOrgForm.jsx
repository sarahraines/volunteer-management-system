import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axiosAPI from "../api/axiosApi";
import { addAlert } from '../actionCreators.js';
import { useDispatch } from 'react-redux';
import "antd/dist/antd.css";
import "./NewOrgForm.css";

const { TextArea } = Input;

const NewOrgForm = () => {
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);
    const dispatch = useDispatch();

    const getCauses = useCallback(async () => {
        try {
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setCauses]);

    useEffect(() => {
        getCauses();
    }, [getCauses]);

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    const onFinish = useCallback(async (values) => {
        try {
            await axiosAPI.post("organization/create/", {
                name: values.name,
                causes: values.causes,
                description: values.description,
                website: values.website,
                phone: values.phone,
                address: values.address,
                email: values.email
            });
            await axiosAPI.post("member/create/", {
                user_id: localStorage.getItem("user_id"),
                organization: values.name,
                member_type: 1,
            });
            dispatch(addAlert('Organization created', 'success'));
        }
        catch {
            dispatch(addAlert('Organization creation failed', 'error'));
        }
    }, [dispatch]);

    return (
        <Form
            name="org"
            className="org-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >   
            <Form.Item
                name="name"
                hasFeedback
                rules={[{ required: true, message: 'Organization name is required.' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Organization name" maxLength={128} />
            </Form.Item>
            <Form.Item
                name="causes"
                hasFeedback
            >
                <Select
                    mode="multiple"
                    placeholder="Charitable cause(s)"
                    value={selectedCauses}
                    onChange={setSelectedCauses}
                >
                    
                {filteredCauses.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="website"
            >
                <Input style={{ width: '100%' }} placeholder="Website" />
            </Form.Item>
            <Form.Item
                name="phone"
            >
                <Input style={{ width: '100%' }} placeholder="Telephone" />
            </Form.Item>
            <Form.Item
                name="email"
                hasFeedback
                rules={[
                    { type: 'email', message: 'Not a valid email.' }
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="address"
            >
                <TextArea style={{ width: '100%' }} placeholder="Street Address" autoSize />
            </Form.Item>
            <Form.Item
                name="description"
                hasFeedback
                rules={[{ required: true, message: 'Organization description is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Describe your organization..." />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    Create organization
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewOrgForm;