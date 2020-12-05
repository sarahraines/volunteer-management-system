import React, {useState, useEffect} from 'react';
import { Upload, Button, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Clearances({isAdmin, orgId}) {
    //front end demo https://codesandbox.io/s/s98mf
    const props = {
    action: '',
    listType: 'picture',
    previewFile(file) {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
        axiosAPI.post('clearances/upload-user-file', {
            file,
            orgId 
        },  {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };

  const orgProps = {
    action: '',
    listType: 'picture',
    previewFile(file) {
      console.log('Your upload file:', file);
      const formData = new FormData();
      formData.append('file', file, "file.txt");
      formData.append('orgId', orgId);
      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
      // Your process logic. Here we just mock to the same file
        axiosAPI.post('clearances/upload-org-file', {
            formData
        }
         ,{
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
        )
        .then(res => res.json())
        // .then(({ thumbnail }) => thumbnail);
    },
  };

    return (
        <div>
            <Title level={4}>Clearances</Title>
            {isAdmin ? 
                <>
                    <Title level={2}>Add Form</Title>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>  
                </Upload>
            }
           
        </div>
    );
};


export default Clearances;