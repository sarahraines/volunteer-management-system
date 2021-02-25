import React from 'react';
import { Typography, Table} from 'antd';

function VolunteerSummary({ data}) {

    const columns = [
        {
            title: '',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
            render: (text: string) => <b>{text}</b>,
        },
        {
          title: 'Nonprofits',
          dataIndex: 'nonprofits',
          key: 'nonprofits',
          ellipsis: true,
        },
        {
          title: 'Events',
          dataIndex: 'events',
          key: 'events',
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
            <Typography.Title level={5}>Summary</Typography.Title>
            <Table 
                dataSource={data} 
                columns={columns}
                expandedRowRender = {record => 
                    <p style={{ margin: 0 }}>
                        <b>Nonprofits: </b>{record.nonprofits_list}<br/>
                        <b>Events: </b>{record.events_list}<br/>
                    </p>
                }
                pagination={false}
            />
            <br/>
            <br/>
        </React.Fragment>
    )


} export default VolunteerSummary;