import React, {useState, useEffect, useCallback} from 'react';
import { Typography } from 'antd';
import NewGoalForm from '../forms/NewGoalForm';
import { usePageView } from '../utils/googleAnalytics'
import VolunteerGoals from '../components/VolunteerGoals';
import axiosAPI from "../api/axiosApi";
import './NewGoal.css';

const NewGoal = () => {

    const user = localStorage.getItem("user_id");

    const [goals, setGoals] = useState([]);

    const getGoals = useCallback(async () => {
        try {
            const response =  await axiosAPI.get("analytics/get-volunteer-goals/", {
                params: {
                    user: user,
                }
            });
            setGoals(response.data);
        } catch(error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
            getGoals();
    }, []);

    usePageView('/set-goal')
    return (
        <React.Fragment>
            <div className='goal-container'>
                <Typography.Title level={2}>Set volunteering goal</Typography.Title>
                <NewGoalForm />
            </div>
            <VolunteerGoals data={goals} />
        </React.Fragment>
    );
};


export default NewGoal;