import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import "./NewOrgForm.css";

const { TextArea } = Input;

const NewOrgForm = ({form, org, closeModalWithUpdate, setLoading}) => {
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);

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

    useEffect(() => {
        if (org?.id) {
            form.setFieldsValue(org);
        }
    }, [org?.id])

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    const onFinish = useCallback(async (values) => {
        if (form) {
            setLoading(true);
        }
        try {
            await axiosAPI.post("organization/upsert/", {
                id: org?.id,
                name: values.name,
                causes: values.causes,
                description: values.description,
                website: values.website,
                phone: values.phone,
                address: values.address,
                email: values.email
            });
            if (!form) {
                await axiosAPI.post("member/create/", {
                    user_id: localStorage.getItem("user_id"),
                    organization: values.name,
                    member_type: 1,
                    status: 0,
                });
            }
            message.success(`Organization ${form ? "updated" : "created"}`);
            if (form) {
                closeModalWithUpdate();
            }
        }
        catch {
            message.error(`Organization ${form ? "update" : "creation"} failed`);
        }
        if (form) {
            setLoading(false);
        }
    }, [org?.id]);

    return (
        <Form
            name="org"
            className="org-form"
            form={form}
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
                rules={[{ required: true, message: 'Charitable causes are required.' }]}
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
            {!form &&
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="org-form-button">
                        Create
                    </Button>
                </Form.Item>
             }
        </Form>
    );
};

export default NewOrgForm;