import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table, Tag, Space } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

function UserFilesTable({orgId, fileList, messageHandler}) {
    const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        onChange(info) {
          messageHandler(info)
        },
        previewFile(file) {
          console.log('Your upload file:', file);
            const formData = new FormData();
            formData.append('filled_form', file, file.name);
            formData.append('orgId', orgId);
    
            return axiosAPI.post('clearances/upload-user-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                }
            })
            .then(({ thumbnail }) => thumbnail);
        },
    };
    
    const columns = [
        {
          title: 'File',
          dataIndex: 'file',
          key: 'file',
          render: text => <a href={"http://localhost:8080/" +text}>{text}</a>,
        },
        {
          title: 'Upload Completed File',
          key: 'upload',
          render: (text, record) => (
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>Upload</Button>  
            </Upload>
          ),
        },
    ];
    
    const data = fileList.map((file,i) => ({"key": i, "file": file.name}))
    
    return (
        <div>
           <Table columns={columns} dataSource={data} />
        </div>
    );
};
export default UserFilesTable;