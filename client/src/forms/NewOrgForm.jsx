import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Radio, Form, Input, Button, Select, message } from 'antd';
import { useDispatch } from 'react-redux'
import { setOrgs, setSidebarItem } from '../actionCreators.js';
import AvatarUpload from "../components/AvatarUpload"
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import "./NewOrgForm.css";

const { TextArea } = Input;

const NewOrgForm = ({form, org, closeModalWithUpdate, setLoading}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);
    const [imageFile, setImageFile] = useState(null);
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
        } else {
            setIsLoading(true);
        }
        try {
            const formdata = new FormData();
            if (org?.id) {
                formdata.append('id', org.id);
            }
            formdata.append('name', values.name);
            formdata.append('causes', values.causes);
            formdata.append('description', values.description);
            formdata.append('website', values.website);
            formdata.append('phone', values.phone);
            formdata.append('address', values.address);
            formdata.append('email', values.email);
            formdata.append('is_public', values.is_public);
            // -1 means retain existing image
            if (imageFile !== -1) {
                formdata.append('image', imageFile);
            }
           
            const newOrg = await axiosAPI.post("organization/upsert/", formdata);
            if (!form) {
                await axiosAPI.post("member/create/", {
                    user_id: localStorage.getItem("user_id"),
                    org_id: newOrg.data.id,
                    member_type: 1,
                    status: 0,
                });
            }
            const response = await axiosAPI.get("user/get-member/", {
                params: {
                    user_id: localStorage.getItem("user_id"), 
                }
            });
            response.data.forEach(member => member.key = member.organization.id)
            dispatch(setOrgs(response.data));
            dispatch(setSidebarItem(newOrg.data.id));
            message.success(`Organization ${form ? "updated" : "created"}`);
            if (form) {
                closeModalWithUpdate();
                setLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        catch {
            message.error(`Organization ${form ? "update" : "creation"} failed`);
        }
        if (form) {
            setLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [setIsLoading, form, imageFile, org?.id]);

    return (
        <Form
            name="org"
            className="org-form"
            form={form}
            onFinish={onFinish}
            initialValues={{
                is_public: true
            }}
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
                name="image"
            >
                <AvatarUpload updateImageField={setImageFile} initialImageURL={org?.image} />
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
            <Form.Item name="is_public">
                <Radio.Group>
                    <Radio value={true}>Public</Radio>
                    <Radio value={false}>Invitation Only</Radio>
                </Radio.Group>
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