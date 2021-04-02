import React, {useState, useCallback, useEffect} from 'react';
import { Table, Radio, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
const { Paragraph } = Typography;

function OrgClearanceTable({orgId, eId}) {
    const [rows, setRows] = useState([]);

    const acceptOrReject = async (value, record) => {
        const status = value.target.value

        try {
            await axiosAPI.post("clearances/set-status-user-file/", 
                {
                    id: record.key, 
                    status: status,
                }
            );
        } catch(error){
            console.error(error)
        }
    };

    const addComment = async (value, record) => {
        try {
            await axiosAPI.post("clearances/set-status-user-file/", 
                {
                    id: record.key, 
                    comment: value,
                }
            );
            getUserFiles(orgId)
        } catch(error) {
            console.error(error)
        }
    };

    const getUserFiles = useCallback(async (orgId) => {
        try {
            const response = await axiosAPI.get("clearances/get-user-files-for-org/", {
                params: {
                    orgId: orgId, 
                    eventId: eId
                }
            });
            const files = response.data;
            const result = files.map(file => ({
                key: file.id, 
                user: file.user__email, 
                url: file.url, 
                status: file.status,
                comment: file.comment
            }))
            setRows(result)
        } catch(error) {
            console.error(error);
        }
    }, [eId]);

    useEffect(() => {
        getUserFiles(orgId)
    }, [orgId, getUserFiles]);
   
    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: text => <p>{text}</p>,
        },
        {
            title: 'File',
            dataIndex: 'url',
            key: 'url',
            render: url => !!url ? <a target="_blank" rel="noopener noreferrer" href={url}>{url.split('/').slice(-1)[0].split('?')[0]}</a> : null,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <Radio.Group defaultValue={record.status} onChange={(value) => acceptOrReject(value, record)} buttonStyle="solid">
                <Radio.Button value="Complete">Accept</Radio.Button>
                <Radio.Button value="Rejected">Reject</Radio.Button>
                </Radio.Group>
            ),
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (text, record, index) => ( 
            (<div style={{ marginLeft: 4, flexGrow: 100 }}>
                <Paragraph style={{ width: "100%" }} editable={{ onChange: (value) => addComment(value, record) }}>{record.comment}</Paragraph>
            </div>))
           
        },
    ];
    
    return (
        <div>
           <Table columns={columns} dataSource={rows} />
        </div>
    );
};
export default OrgClearanceTable;