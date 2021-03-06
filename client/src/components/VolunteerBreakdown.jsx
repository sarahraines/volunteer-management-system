import React from 'react';
import { Typography, Table} from 'antd';
import Plot from 'react-plotly.js';

function VolunteerBreakdown({data}) {
    const columns = [
        { 
            title: '',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
            render: (text: string) => <b>{text}</b>,
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          ellipsis: true,
        },
        {
          title: 'Hours',
          dataIndex: 'hours',
          key: 'hours',
          ellipsis: true,
        },
      ];


    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={5}>Volunteer Breakdown</Typography.Title>

            <Table 
                dataSource={data} 
                columns={columns}
                expandedRowRender = {record => <p style={{ margin: 0 }}><b>Volunteer Names: </b>{record.name}</p>}
                rowExpandable = {record => record.label !== 'Total'}
                pagination={false}
            />
            <br/>
            <br/>
        </React.Fragment>
    )


} export default VolunteerBreakdown;