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
        
    };

    function previewFile(orgFileId, file) {
        console.log('Your upload file:', file);
        const formData = new FormData();
        // console.log('file list', fileList[0].uid)
        console.log("org file id" + orgFileId)
        console.log("org file id above")
        formData.append('org_file_id', orgFileId);
        formData.append('user_id', localStorage.getItem("user_id"))
        formData.append('filled_form', file, file.name);

        return axiosAPI.post('clearances/upload-user-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            }
        })
        .then(({ thumbnail }) => thumbnail);
    }
    
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
          render: (text, record, index) => (
            <Upload {...props} 
                beforeUpload={file => {
                    console.log("key:", record.key)
                    console.log("file:", record.file)
                    console.log("index:", index)

                    const formData = new FormData();
                    formData.append('org_file_id', record.key);
                    formData.append('user_id', localStorage.getItem("user_id"))
                    formData.append('filled_form', file, file.name);

                    return axiosAPI.post('clearances/upload-user-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                        }
                    })
                    .then(({ thumbnail }) => thumbnail);
                }}
            >
                <Button icon={<UploadOutlined/> } onClick = {
                    (e) => {
                        
                    }}
                > Upload </Button>  
            </Upload>
          ),
        },
    ];
    console.log(fileList)
    
    const data = fileList.map((file,i) => ({"key": file.uid, "file": file.name}))

    return (
        <div>
           <Table columns={columns} dataSource={data}/>
        </div>
    );
};
export default UserFilesTable;