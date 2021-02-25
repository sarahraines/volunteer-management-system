import React, {useState, useCallback, useEffect} from 'react';
import { Table, Radio, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
const { Paragraph } = Typography;

function OrgClearanceTable({orgId, eId}) {
    const [rows, setRows] = useState([]);

    function acceptOrReject(value, record) {
        console.log(value.target.value)
        console.log(record)

        const status = value.target.value

        try {
            const response = axiosAPI.post("clearances/set-status-user-file/", 
                {
                    id: record.key, 
                    status: status,
                }
        );
        } catch(error){
            console.error(error)
        }
    };

    function addComment(value, record) {
        const comment = value

        try {
            const response = axiosAPI.post("clearances/set-status-user-file/", 
                {
                    id: record.key, 
                    comment: comment,
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
            const result = files.map((file,i) => ({
                key: file.id, 
                user: file.user__email, 
                file: file.filled_form.split('/').slice(-1).pop(), 
                status: file.status,
                comment: file.comment
            }))

            console.log(result)
            setRows(result)
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getUserFiles(orgId)
    }, [orgId]);
   
    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: text => <p>{text}</p>,
        },
        {
            title: 'File',
            dataIndex: 'file',
            key: 'file',
            render: text => <a href={"http://localhost:8080/" +text}>{text}</a>,
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
            render: (text,record, index) => ( 
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