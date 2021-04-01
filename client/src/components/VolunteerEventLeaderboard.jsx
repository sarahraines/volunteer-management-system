import React from 'react';
import { Typography, Table} from 'antd';

function VolunteerEventLeaderboard({ data}) {

    console.log(data); 

    const columns = [
        {
            title: 'Event',
            dataIndex: 'event__name',
            key: 'event__name',
        },
        {
            title: 'Nonprofit',
            dataIndex: 'event__organization__name',
            key: 'event__organization__name',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Rating',
            dataIndex: 'overall',
            key: 'overall',
            sorter: (a, b) => a.overall - b.overall,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Satisfaction',
            dataIndex: 'satisfaction',
            key: 'satisfaction',
            sorter: (a, b) => a.satisfaction - b.satisfaction,
            defaultSortOrder: 'descend',
        },
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={5}>Event Leaderboard</Typography.Title>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                dataSource={data} />
        </React.Fragment>
    )


} export default VolunteerEventLeaderboard;

