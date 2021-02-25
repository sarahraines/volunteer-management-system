import React from 'react';
import { Typography } from 'antd';
import NewGoalForm from '../forms/NewGoalForm';
import './NewGoal.css';

const NewGoal = () => {
    return (
        <div className='goal-container'>
            <Typography.Title level={2}>Set volunteering goal</Typography.Title>
            <NewGoalForm />
        </div>
    );
};


export default NewGoal;