import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import UserFilesTable from './UserFilesTable';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function Clearances({isAdmin, orgId}) {
    const [fileList, setFileList] = useState([]);

    let host = window.location.origin + '/';
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        host = `http://${window.location.hostname}:8000/`
    }

    const getOrgFiles = useCallback(async (orgId) => {
        try {
            const response = await axiosAPI.get("clearances/get-org-files/", {
                params: {
                    orgId: orgId, 
                }
            });
            const files = response.data;
            const formattedFiles = files.map(file => ({
                uid: file.id, 
                name: file.empty_form.split('/').slice(-1).pop(), 
                status: "done", 
                url: file.empty_form
            }));

            setFileList(formattedFiles);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getOrgFiles(orgId)
    }, [orgId]);

    function messageHandler(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }

        if (info.file.status === 'done') {
          message.success('File upload success');
        } else if (info.file.status === 'error') {
          message.error('File upload failed');
        }
    }

    const orgProps = {
        listType: 'picture',
        fileList: fileList,
        onChange(info) {
            messageHandler(info)
            let fl = [...info.fileList];
            fl = fl.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.empty_form;
                }
                return file;
            });
                
            setFileList(fl);
        },
        customRequest: async function(options) {
            const formData = new FormData();
            formData.append('empty_form', options.file, options.file.name);
            formData.append('orgId', orgId);
            try {
                let data = await axiosAPI.post('clearances/upload-org-file', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    }
                });
                options.onSuccess(data, options.file);
            } catch (error) {
                console.log(error)
            }
        },
    };
    return (
        <div>
            <Title level={4}>Clearances</Title>
            {isAdmin ? 
                <>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                
                <UserFilesTable orgId={orgId} fileList={fileList} messageHandler={messageHandler}/>
            }
           
        </div>
    );
};
export default Clearances;