import React from 'react';
import { Typography, Table, Progress} from 'antd';

function VolunteerGoals({ data}) {
    

    const columns = [
        {
            title: 'Start Date',
            dataIndex: 'begindate',
            key: 'begindate',
            defaultSortOrder: 'descend'
        },
        {
            title: 'End Date',
            dataIndex: 'enddate',
            key: 'enddate',
            defaultSortOrder: 'ascend'
        },
        {
            title: 'Hours Completed',
            dataIndex: 'completed',
            key: 'completed',
        },
        {
            title: 'Goal Hours',
            dataIndex: 'hours',
            key: 'hours',
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, record) => (
                <Progress percent={record.progress}/>
            ),
        },
    ];


    return (
        <React.Fragment>
            <Typography.Title level={5}>Goals</Typography.Title>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                dataSource={data} />
        </React.Fragment>
    )


} export default VolunteerGoals;

