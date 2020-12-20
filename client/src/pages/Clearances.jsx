import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';
import UserFilesTable from './UserFilesTable';
const { Title } = Typography;

function Clearances({isAdmin, orgId}) {
    const [fileList, setFileList] = useState([]);
    const getOrgFiles = useCallback(async (orgId) => {
        try {
             const response = await axiosAPI.get("clearances/get-org-files/", {
                 params: {
                     orgId: orgId, 
                 }
             });
            const files = response.data;
            setFileList(files)
            console.log("fetched files")
            console.log(files);
        } catch(error) {
            console.error(error);
        }
    }, [])

    useEffect(() => {
        getOrgFiles(orgId)
    }, [orgId]);

    //front end demo https://codesandbox.io/s/s98mf
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
        let fl = [...info.fileList];
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fl = fl.slice(-2);
        fl = fl.map(file => {
            if (file.response) {
              // Component will show file.url as link
              console.log(file)
              file.url = "http://localhost:8080/"+ file.name;
            }
            return file;
        });
      
          setFileList(fl);
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

  const orgProps = {
    listType: 'picture',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange( info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        let fl = [...info.fileList];
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fl = fl.slice(-2);
        fl = fl.map(file => {
            if (file.response) {
              // Component will show file.url as link
              console.log(file)
              file.url = "http://localhost:8080/"+ file.name;
            }
            return file;
        });
      
          setFileList(fl);
    },
    previewFile: async function(file) {
      const formData = new FormData();
      formData.append('empty_form', file, file.name);
      formData.append('orgId', orgId);
      // Your process logic. Here we just mock to the same file
        try {
            return await axiosAPI.post('clearances/upload-org-file', formData,{
                headers: {
                // 'Content-Type': 'multipart/form-data'
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
                }
            }
            )
            // .then(res => res.json())
            .then(({ thumbnail }) => thumbnail);
        } catch {
            console.log("upload failed")
        }
        
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
                
                // <Upload {...props}>
                //     <Button icon={<UploadOutlined/>}>Upload</Button>  
                // </Upload>
                <UserFilesTable orgId={orgId} fileList={fileList}/>
            }
           
        </div>
    );
};
export default Clearances;