import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Clearances({isAdmin, orgId}) {

    const getOrgFiles = useCallback(async () => {
        try {
            console.log("orgId" +orgId);
             const response = await axiosAPI.get("clearances/get-org-files/", {
                 params: {
                     orgId: orgId, 
                 }
             });
            const files = response.data;
            console.log("fetched files")
            console.log(files);
        } catch(error) {
            console.error(error);
        }
    }, [])
    const [fileList, setFileList] = useState([]);
    //front end demo https://codesandbox.io/s/s98mf
    const props = {
    action: '',
    listType: 'picture',
    previewFile(file) {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
        return axiosAPI.post('clearances/upload-user-file', {
            file,
            orgId 
        },  {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        // .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };
//   useEffect(() => {
//     getOrgFiles()
// }, [orgId]);

  const orgProps = {
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
      console.log("hitting preview file")
      formData.append('empty_form', file, file.name);
      formData.append('orgId', orgId);
      // Your process logic. Here we just mock to the same file
        try {
            return await axiosAPI.post('clearances/upload-org-file/', formData,{
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
                
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>  
                </Upload>
            }
           
        </div>
    );
};

// customRequest: async function (file) {
//     const formData = new FormData();
//     formData.append('empty_form', new Blob([file], {type: "image/png"}), file.originFileObj?.name);
//     formData.append('orgId', orgId);
//     // Your process logic. Here we just mock to the same file
//       try {
//            await axiosAPI.post('clearances/upload-org-file', formData,{
//               headers: {
//               // 'Content-Type': 'multipart/form-data'
//               'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  
//               }
//           }
//           )
//           // .then(({ thumbnail }) => thumbnail);

//       } catch(err) {
//           console.log(err)
//       }
export default Clearances;