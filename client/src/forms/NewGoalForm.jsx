import React, { useCallback } from 'react';
import { Form, Input, Button, DatePicker} from 'antd';
import axiosAPI from "../api/axiosApi";
import { addAlert } from '../actionCreators.js';
import { useDispatch } from 'react-redux';
import "antd/dist/antd.css";
import "./NewOrgForm.css";

const { RangePicker } = DatePicker;

const NewGoalForm = () => {
    const dispatch = useDispatch();

    const onFinish = useCallback(async (values) => {
        try {
            await axiosAPI.post("user/create-goal/", {
                user_id: localStorage.getItem("user_id"),
                hours: values.hours,
                date: values.date,
            });
            dispatch(addAlert('Goal created', 'success'));
        }
        catch {
            dispatch(addAlert('Goal creation failed', 'error'));
        }
    }, [dispatch]);

    return (
        <Form
            name="goal"
            className="goal-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        > 
            <Form.Item
                    name="hours"
                    hasFeedback
                    rules={[{ required: true, message: 'Hours is required and must be a number.'}]}
                >
                    <Input style={{ width: '100%' }} placeholder="Volunteer Hours" type="tel"/>
            </Form.Item>
            <Form.Item
                name="date"
                hasFeedback
                rules={[{ required: true, message: 'Date is required.' }]}
            >
                <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    Set volunteering goal
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewGoalForm;