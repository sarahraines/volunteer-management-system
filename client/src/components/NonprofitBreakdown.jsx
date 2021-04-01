import React from 'react';
import { Typography, Table} from 'antd';

function NonprofitBreakdown({ data}) {

    const columns = [
        {
            title: 'Nonprofit',
            dataIndex: 'events__organization__name',
            key: 'events__organization__name',
        },
        {
            title: 'Events',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count - b.count,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
            sorter: (a, b) => a.hours - b.hours,
            defaultSortOrder: 'descend',
        },
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={5}>Nonprofit Breakdown</Typography.Title>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                expandedRowRender = {record => <p style={{ margin: 0 }}><b>Events Attended: </b>{record.events}</p>}
                dataSource={data} />
        </React.Fragment>
    )


} export default NonprofitBreakdown;

