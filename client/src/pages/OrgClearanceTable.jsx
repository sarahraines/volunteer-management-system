import React, {useState, useCallback, useEffect} from 'react';
import { Table, Radio } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

function OrgClearanceTable({orgId}) {
    const [rows, setRows] = useState([]);

    function acceptOrReject(value, record) {
        console.log(value.target.value)
        console.log(record)

        const s = (value.target.value === "accept")

        try {
            const response = axiosAPI.post("clearances/set-status-user-file/", 
                {
                    id: record.key, 
                    status: s,
                }
        );
        } catch(error){
            console.error(error)
        }
    };

    const getUserFiles = useCallback(async (orgId) => {
        try {
            const response = await axiosAPI.get("clearances/get-user-files-for-org/", {
                params: {
                    orgId: orgId, 
                }
            });
            const files = response.data;
            const result = files.map((file,i) => ({
                key: file.id, 
                user: file.user__email, 
                file: file.filled_form.split('/').slice(-1).pop(), 
                status: file.status 
            }))

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
                <Radio.Group defaultValue={record.status? "accept": "reject"} onChange={(value) => acceptOrReject(value, record)} buttonStyle="solid">
                <Radio.Button value="accept">Accept</Radio.Button>
                <Radio.Button value="reject">Reject</Radio.Button>
                </Radio.Group>
            ),
        },
    ];
    
    return (
        <div>
           <Table columns={columns} dataSource={rows} />
        </div>
    );
};
export default OrgClearanceTable;