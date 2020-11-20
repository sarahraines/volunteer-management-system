import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, DatePicker} from 'antd';
import axiosAPI from "../api/axiosApi";
import { useDispatch } from 'react-redux';
import { addAlert } from '../actionCreators.js';
import "antd/dist/antd.css";
import "./NewEventForm.css"

const {TextArea} = Input;

const { RangePicker } = DatePicker;

const NewEventForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            await axiosAPI.post("event/create/", {
                name: values.name,
                virtual: values.virtual,
                location: values.location,
                causes: values.causes,
                organizations: values.organizations,
                date:values.date,
                description: values.description,
            });
            dispatch(addAlert('Event created', 'success'));
        }
        catch {
            dispatch(addAlert('Event creation failed', 'error'));
        }
        setIsLoading(false);
    }, []);

    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);

     useEffect(() => {
        getCauses();
    }, []);

    const getCauses = async () => {
        try{
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        getOrgs();
    }, []);

    const getOrgs = async () => {
        try{
            const response = await axiosAPI.get("admin/get-orgs/", {
                 params: {
                     user_id: localStorage.getItem("user_id"),  
                 }
             });
            setOrgs(response.data);
        } catch (error) {
            console.error(error)
        }
    }
    
    const filteredOrgs = useMemo(() => {
        return orgs.filter(o => !selectedOrgs.includes(o));
    }, [selectedOrgs, orgs]);

  return (
    <Form
        name="event"
        className="event-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
    >   
        <Form.Item
            name="organizations"
            hasFeedback
            rules={[{ required: true, message: 'Organization name is required.' }]}
        >
            <Select
                mode="multiple"
                placeholder="Organization(s)"
                value={selectedOrgs}
                onChange={setSelectedOrgs}
                style={{ width: '100%' }}
            >
                
            {filteredOrgs.map(item => (
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
            name="virtual"
            hasFeedback
            valuePropName="checked"
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
              <RangePicker style={{ width: '100%' }} showTime />
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
            name="description"
            hasFeedback
            rules={[{ required: true, message: 'Description is required.' }]}
        >
            <TextArea row={6} style={{ width: '100%' }} placeholder="Event description" />
        </Form.Item>
         <Form.Item>
            <Button type="primary" htmlType="submit" className="event-form-button" loading={isLoading}>
                Create event
            </Button>
        </Form.Item>
    </Form>
  );
};


export default NewEventForm;