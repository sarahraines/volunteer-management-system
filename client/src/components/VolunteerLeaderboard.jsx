import React from 'react';
import { Typography, Table} from 'antd';

function VolunteerLeaderboard({ data}) {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Events Attended',
            dataIndex: 'count',
            key: 'count',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: 'Volunteer Hours',
            dataIndex: 'total',
            key: 'total',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.total - b.total,
        },
    ];

    return (
        <React.Fragment>
            <Typography.Title level={5}>Volunteer Leaderboard</Typography.Title>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                expandedRowRender = {record => <p style={{ margin: 0 }}><b>Events Attended: </b>{record.event_list}</p>}
                dataSource={data} />
        </React.Fragment>
    )


} export default VolunteerLeaderboard;