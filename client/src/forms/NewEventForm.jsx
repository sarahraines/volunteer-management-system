import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, DatePicker, InputNumber, message } from 'antd';
import axiosAPI from "../api/axiosApi";
import { useDispatch } from 'react-redux';
import "antd/dist/antd.css";
import "./NewEventForm.css"
import AvatarUpload from "../components/AvatarUpload"

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const NewEventForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const dispatch = useDispatch();

    const getCauses = useCallback(async () => {
        try{
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setCauses]);

    const getOrgs = useCallback(async () => {
        try {
            const response = await axiosAPI.get("admin/get-orgs/", {
                 params: {
                     user_id: localStorage.getItem("user_id"),  
                 }
             });
            setOrgs(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setOrgs]);

    useEffect(() => {
        getCauses();
        getOrgs();
    }, [getCauses, getOrgs]);
    
    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            const form = new FormData();
            form.append('name', values.name);
            form.append('virtual', values.virtual);
            form.append('location', values.location);
            form.append('causes', values.causes);
            form.append('organization', values.organization);
            form.append('begindate', values.date[0].toISOString());
            form.append('enddate', values.date[1].toISOString());
            form.append('description', values.description);
            form.append('instructions', values.instructions);
            form.append('image', imageFile);

            await axiosAPI.post("event/create/", form);
            message.success('Event created');
        }
        catch {
            message.error('Event creation failed');
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, imageFile]);

    return (
        <Form
            name="event"
            className="event-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
        >   
            <Form.Item
                name="organization"
                hasFeedback
                rules={[{ required: true, message: 'Organization name is required.' }]}
            >
                <Select
                    placeholder="Organization"
                    value={selectedOrgs}
                    onChange={setSelectedOrgs}
                    style={{ width: '100%' }}
                >
                    
                {orgs.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="name"
                hasFeedback
                rules={[{ required: true, message: 'Event name is required.' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Event name" />
            </Form.Item>
            <Form.Item
                name="avatar"
            >
                <AvatarUpload updateImageField={setImageFile} />
            </Form.Item>
            <Form.Item
                name="virtual"
                hasFeedback
                valuePropName="checked"
                initialValue={true}
            >
                <Switch checkedChildren="Virtual" unCheckedChildren="Non-virtual" defaultChecked />
            </Form.Item>
            <Form.Item
                name="location"
                hasFeedback
                rules={[{ required: true, message: 'Location is required.' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Location" />
            </Form.Item>
            <Form.Item
                name="date"
                hasFeedback
                rules={[{ required: true, message: 'Date is required.' }]}
            >
                <RangePicker style={{ width: '100%' }}  showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item
                name="causes"
                hasFeedback
                rules={[{ required: true, message: 'Causes are required.' }]}
            >
                <Select
                    mode="multiple"
                    placeholder="Charitable cause(s)"
                    value={selectedCauses}
                    onChange={setSelectedCauses}
                    style={{ width: '100%' }}
                >
                    
                {filteredCauses.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="attendeeCap"
                hasFeedback
                rules={[{ required: true, message: 'Max number of attendees is required and must be a number.'}]}
            >
                
                <InputNumber style={{ width: '100%' }} placeholder="Maximum number of attendees"/>
            </Form.Item>
            <Form.Item
                name="description"
                hasFeedback
                rules={[{ required: true, message: 'Description is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Event description" />
            </Form.Item>
            <Form.Item
                name="instructions"
                hasFeedback
                rules={[{ required: true, message: 'Instructions is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Provide volunteers with instructions (i.e. how to get there, what to bring, etc.)" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="event-form-button" loading={isLoading}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
};


export default NewEventForm;