import React,  {useState} from 'react';
import { Typography, Table, Input, Select} from 'antd';

const { Search } = Input;
const { Option } = Select;

function VolunteerLeaderboard({data}) {

    const [filterDisplay, setFilterDisplay] = useState(data[2]);

    const handleChange = e => {
        let oldList = data[2];
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(volunteer =>
                volunteer.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const timeFilterChange = value => {
        if(value === "month"){
            setFilterDisplay(data[0]);
        }
        else if(value === "year"){
            setFilterDisplay(data[1]);
        }
        else {
            setFilterDisplay(data[2]); 
        }
    };

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
            <Search placeholder="search by volunteer" onChange={e => handleChange(e.target.value)} style={{ width: 300, marginBottom: 16 }}  />

            <Select defaultValue="none" style={{ width: 120, marginBottom : 16, float: 'right'}} onChange={value => timeFilterChange(value)} size="medium">
                <Option value="none">All Events</Option>
                <Option value="month">Past Month</Option>
                <Option value="year">Past Year</Option>
            </Select>
            <Table
                columns={columns}
                pagination={{ pageSize: 5 }}
                expandedRowRender = {record => <p style={{ margin: 0 }}><b>Events Attended: </b>{record.event_list}</p>}
                dataSource={filterDisplay} />
        </React.Fragment>
    )


} export default VolunteerLeaderboard;