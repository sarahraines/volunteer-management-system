import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table, Tag, Space } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

function UserFilesTable({orgId, fileList, messageHandler}) {
    const [userFileList, setUserFileList] = useState([]);
    const getUserFiles = useCallback(async (orgId) => {
        try {
             const response = await axiosAPI.get("clearances/get-user-files/", {
                 params: {
                     userId: localStorage.getItem("user_id"), 
                     orgId: orgId
                 }
             });
            const files = response.data;
            const formattedFiles = files.map(file => ({uid: file.id, orgFormId: file.org_file, name: file.filled_form.split('/').slice(-1).pop(), status: "done", url: file.filled_form}));
            console.log("User Formatted Files", formattedFiles)
            setUserFileList(formattedFiles);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getUserFiles(orgId)
    }, [orgId]);

    const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        onChange(info) {
          messageHandler(info)
        },
        
    };
    
    const columns = [
        {
            title: 'Uncompleted File',
            dataIndex: 'file',
            key: 'file',
            render: text => <a href={"http://localhost:8080/" +text}>{text}</a>,
        },
        {
            title: 'Your Uploaded File',
            dataIndex: 'uploaded_file',
            key: 'uploaded_file',
            render: text => <a href={"http://localhost:8080/" +text}>{text}</a>,
        },
        {
            title: 'Upload New File',
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
                    // onChange={info => {
                    //     console.log("onChange info",info)
                    //     console.log("onChange info.file.name",[info.file])

                    //     try {
                    //         const response = await axiosAPI.get("clearances/get-user-files/", {
                    //             params: {
                    //                 orgFileId: record.key, 
                    //             }
                    //         });
                    //        const files = response.data;
                    //        const formattedFiles = files.map(file => ({uid: file.id, name: file.empty_form.split('/').slice(-1).pop(), status: "done", url: file.empty_form}));
                    //        setFileList(formattedFiles);
                    //     } catch(error) {
                    //        console.error(error);
                    //     }
                    // }}
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

    function getUserFileForOrgFile(oFormId) {
        if ((userFileList.filter(ufile => ufile.orgFormId == oFormId)).length > 0) {
            return userFileList.filter(ufile => ufile.orgFormId == oFormId)[0].name;
        }
        return (null);
    }
    
    const data = fileList.map((file,i) => ({
        "key": file.uid, 
        "uploaded_file": getUserFileForOrgFile(file.uid),
        "file": file.name}))

    return (
        <div>
           <Table columns={columns} dataSource={data}/>
        </div>
    );
};
export default UserFilesTable;