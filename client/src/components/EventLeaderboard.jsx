import React,  {useState} from 'react';
import { Typography, Table, Input, Select} from 'antd';
import EventLeaderboardPlots from '../components/EventLeaderboardPlots';

const { Search } = Input;
const { Option } = Select;

function EventLeaderboard({data}) {

    const [filterDisplay, setFilterDisplay] = useState(data);

    const handleChange = e => {
        let oldList = data;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(event =>
                event.event__name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const timeFilterChange = value => {
        let oldList = data;
        if(value === "month"){

            let d = new Date(); 
            let newList = []

            d.setMonth(d.getMonth() - 1);
            d.setHours(0, 0, 0, 0);

            newList = oldList.filter(event => parseInt(new Date(event.event__begindate.slice(0, 10)).valueOf(), 10) - parseInt(d.valueOf(), 10) > 0); 
            setFilterDisplay(newList);
        }
        else if(value === "year"){
            let d = new Date(); 
            let newList = []

            d.setYear(d.getFullYear() - 1);

            newList = oldList.filter(event => parseInt(new Date(event.event__begindate.slice(0, 10)).valueOf(), 10) - parseInt(d.valueOf(), 10) > 0); 
            setFilterDisplay(newList);
        }
        else {
            setFilterDisplay(oldList);
        }
    };

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
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.avg_rating - b.avg_rating,
        },
        {
            title: 'Average Satisfaction',
            dataIndex: 'avg_satisfaction',
            key: 'avg_satisfaction',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.avg_satisfaction - b.avg_satisfaction,
        },
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={5}>Event Leaderboard</Typography.Title>
                <Search placeholder="search by event" onChange={e => handleChange(e.target.value)} style={{ width: 300, marginBottom: 16 }}  />
                
                <Select defaultValue="none" style={{ width: 120, marginBottom : 16, float: 'right'}} onChange={value => timeFilterChange(value)} size="medium">
                    <Option value="none">All Events</Option>
                    <Option value="month">Past Month</Option>
                    <Option value="year">Past Year</Option>
                </Select>

            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                expandedRowRender= {record => 
                    <p>
                        <b>Event Details</b><br/>
                        Name: {record.event__name}<br/>
                        Location: {record.event__location}<br/>
                        Date: {(new Date(record.event__begindate)).toLocaleString('en-US', options)} - {(new Date(record.event__enddate)).toLocaleString('en-US', options)}<br/><br/>

                        <b>Attendes: </b>
                        {record.attendees}<br/><br/>

                        <EventLeaderboardPlots data={record}/>
                    </p>
                }
                dataSource={filterDisplay} />
        </React.Fragment>
    )


} export default EventLeaderboard;

