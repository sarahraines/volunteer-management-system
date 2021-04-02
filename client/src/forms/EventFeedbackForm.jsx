import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select} from 'antd';
import axiosAPI from "../api/axiosApi";
import { useDispatch } from 'react-redux';
import { addAlert } from '../actionCreators.js';
import "antd/dist/antd.css";
import "./EventFeedbackForm.css"

const {TextArea} = Input;

const EventFeedbackForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);   

    const getEvents = useCallback(async () => {
        try {
            const response = await axiosAPI.get("attendees/get-volunteer-events/", {
                 params: {
                     user_id: localStorage.getItem("user_id"),  
                 }
            });
            setEvents(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setEvents]);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            await axiosAPI.post("eventFeedback/create/", {
                id: events.filter(event => event.events__id === selectedEvent).map(event => event.id)[0],
                event: values.event,
                overall: values.overall,
                satisfaction: values.satisfaction,
                likely: values.likely,
                expectations: values.expectations,
                future: values.future,
                better: values.better,
                experience: values.experience,
            });
            dispatch(addAlert('Feedback submitted', 'success'));
        }
        catch {
            dispatch(addAlert('Feedback submission failed', 'error'));
        }
        setIsLoading(false);
    }, [dispatch, events, selectedEvent]);

    const options = [
        { label: 'Poor', value: 1},
        { label: 'Fair', value: 2 },
        { label: 'Average', value: 3},
        { label: 'Good', value: 4},
        { label: 'Excellent', value: 5},
    ];

    const s_options = [
        { label: 'Very Dissatisfied', value: 1},
        { label: 'Dissatisfied', value: 2},
        { label: 'Neutral', value: 3},
        { label: 'Satisfied', value: 4},
        { label: 'Very Satisfied', value: 5},
    ];
    const l_options = [
        { label: 'Very Unlikely', value: 1},
        { label: 'Somewhat Unlikely', value: 2},
        { label: 'Neutral', value: 3},
        { label: 'Somewhat Likely', value: 4},
        { label: 'Very Likely', value: 5},
    ];
    const yn_options = [
        { label: 'Yes', value: 'Yes'},
        { label: 'No', value: 'No'},
    ];

    return (
        <Form
            name="event-feedback"
            className="event-feedback-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >

            <p>Which event would you like to provide feedback for?</p>
            <Form.Item
                    name="event"
                    hasFeedback
                    rules={[{ required: true, message: 'Event is required.' }]}
            >
                <Select
                    placeholder="Attended Events"
                    value={selectedEvent}
                    onChange={setSelectedEvent}
                    style={{ width: '100%' }}
                >
                    {events.map(item => (
                        <Select.Option key={item.events__id} value={item.events__id}>
                            {item.events__name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <p>How would you rate your overall experience?</p>
            <Form.Item
                name="overall"
                hasFeedback
                rules={[{ required: true, message: 'Overall experience rating required.' }]}
            >
            <Radio.Group
                options={options}
                optionType="button"
                buttonStyle="solid"
            />
            </Form.Item>
            <p>How satisfied did you feel after volunteering?</p>
            <Form.Item
                name="satisfaction"
                hasFeedback
                rules={[{ required: true, message: 'Satisfaction rating required.' }]}
            >
            <Radio.Group
                options={s_options}
                optionType="button"
                buttonStyle="solid"
            />
            </Form.Item>
            <p>How likely are you to recommend future volunteer opportunities to your friends?</p>
            <Form.Item
                name="likely"
                hasFeedback
                rules={[{ required: true, message: 'Recommend rating required.' }]}
            >
            <Radio.Group
                options={l_options}
                optionType="button"
                buttonStyle="solid"
            />
            </Form.Item>
            <p>Did the experience meet your expectations?</p>
            <Form.Item
                name="expectations"
                hasFeedback
                rules = {[{ required: true, message: 'Expectations rating required.' }]}>
            <Radio.Group options={yn_options}/>
            </Form.Item>
            <p>Do you plan to volunteer with us again in the future?</p>
            <Form.Item
                name="future"
                hasFeedback
                rules = {[{ required: true, message: 'Future rating required.' }]}>
            <Radio.Group options={yn_options}/>
            </Form.Item>
            <p>What could we have done better?</p>
            <Form.Item
                name="better"
                hasFeedback
                rules = {[{ required: true, message: 'Improvement feedback is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Response here" />
            </Form.Item>
            <p>Is there anything else we should know about your volunteer experience?</p>
            <Form.Item
                name="experience"
                hasFeedback       
                rules = {[{ required: true, message: 'Experience feedback is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Response here" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="event-feedback-form-button" loading={isLoading}>
                    Submit feedback
                </Button>
            </Form.Item>
        </Form>
    );
};


export default EventFeedbackForm;