import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table, Tag, Space, Radio } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

function OrgClearanceTable({orgId}) {
    const [rows, setRows] = useState([]);
    const getUserFiles = useCallback(async (orgId) => {
        try {
             const response = await axiosAPI.get("clearances/get-user-files-for-org/", {
                 params: {
                     orgId: orgId, 
                 }
             });
            const files = response.data;
            console.log(files[0].user)
            const result = files.map((file,i) => ({key: i, user: file.user, file: file.filled_form.split('/').slice(-1).pop() }))
            setRows(result)
            console.log(files);

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
          render: () => (
          <Radio.Group  buttonStyle="solid">
          <Radio.Button value="a">Accept</Radio.Button>
          <Radio.Button value="b">Reject</Radio.Button>
        </Radio.Group>)
          ,
        },
    ];
    
    
    return (
        <div>
           <Table columns={columns} dataSource={rows} />
        </div>
    );
};
export default OrgClearanceTable;