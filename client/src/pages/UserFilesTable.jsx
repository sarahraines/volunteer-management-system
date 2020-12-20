import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table, Tag, Space } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

function UserFilesTable({orgId, fileList}) {
    const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        onChange( info) {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
        },
        previewFile(file) {
          console.log('Your upload file:', file);
          // Your process logic. Here we just mock to the same file
            const formData = new FormData();
            formData.append('filled_form', file, file.name);
            formData.append('orgId', orgId);
    
            return axiosAPI.post('clearances/upload-user-file', formData, {
                headers: {
                    // 'Content-Type': 'multipart/form-data'
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                }
            })
            // .then(res => res.json())
            .then(({ thumbnail }) => thumbnail);
        },
    };
    
    const columns = [
        {
          title: 'File',
          dataIndex: 'file',
          key: 'file',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Upload Completed File',
          key: 'upload',
          render: (text, record) => (
            // <Space size="middle">
            //   <a>Invite {record.name}</a>
            //   <a>Delete</a>
            // </Space>
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>Upload</Button>  
            </Upload>
          ),
        },
    ];
    
    const data = fileList.map((file,i) => ({"key": i, "file": "File"}))
    
    return (
        <div>
            {/* {isAdmin ? 
                <>
                    <Title level={2}>Add Form</Title>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>  
                </Upload>
            } */}
           <Table columns={columns} dataSource={data} />
        </div>
    );
};
export default UserFilesTable;