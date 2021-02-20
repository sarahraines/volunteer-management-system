import React from 'react';
import { Typography, Table} from 'antd';
import EventLeaderboardPlots from '../components/EventLeaderboardPlots';

function EventLeaderboard({ data}) {

    const columns = [
        {
            title: 'Event',
            dataIndex: 'event__name',
            key: 'event__name',
        },
        {
            title: 'Volunteers',
            dataIndex: 'count',
            key: 'count',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: 'Average Rating',
            dataIndex: 'avg_rating',
            key: 'avg_rating',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: 'Average Satisfaction',
            dataIndex: 'avg_satisfaction',
            key: 'avg_satisfaction',
            sorter: (a, b) => a.total - b.total,
        },
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={5}>Event Leaderboard</Typography.Title>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                expandedRowRender= {record => 
                    <body>
                        <b>Event Details</b><br/>
                        Name: {record.event__name}<br/>
                        Location: {record.event__location}<br/>
                        Date: {(new Date(record.event__begindate)).toLocaleString('en-US', options)} - {(new Date(record.event__enddate)).toLocaleString('en-US', options)}<br/><br/>

                        <b>Attendes: </b>
                        {record.attendees}<br/><br/>

                        <EventLeaderboardPlots data={record}/>
                    </body>
                } 
                dataSource={data} />
        </React.Fragment>
    )


} export default EventLeaderboard;

