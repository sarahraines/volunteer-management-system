import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, Table, Tag, Space } from 'antd';
import {StatusTag} from '../components/StatusTag';
import {StatusFilter} from '../components/StatusFilter';
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
            console.log("files", files)

            function getStatus(status) {
                if (status) {
                    return "Complete";
                } else if (!status) {
                    return "Pending";
                }
            }

            const formattedFiles = files.map(file => ({
                uid: file.id, 
                orgFormId: file.org_file, 
                name: file.filled_form.split('/').slice(-1).pop(), 
                status: getStatus(file.status),
                url: file.filled_form
            }));
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
            getUserFiles(orgId)
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // render: (text, record) => console.log("record", record)
            render: (text, record) => <StatusTag status={record.status} />
        },
        {
            title: 'Upload New File',
            key: 'upload',
            render: (record) => (
                <Upload {...props} 
                    beforeUpload={file => {
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
                    <Button icon={<UploadOutlined/>}> Upload </Button>  
                </Upload>
            ),
        },
    ];

    function getUserFileForOrgFile(infoType, oFormId) {
        console.log("ufl", (userFileList.filter(ufile => ufile.orgFormId == oFormId)))
        if ((userFileList.filter(ufile => ufile.orgFormId == oFormId)).length > 0) {
            const userFile = userFileList.filter(ufile => ufile.orgFormId == oFormId)[0]
            if (infoType == "name") {
                return userFile.name;
            } else if (infoType == "status") {
                return userFile.status
            }
        }

        if (infoType == "status") {
            return "Incomplete";
        }
        return (null)
    }
    
    const [data, setData] = useState([]);

    function getAllData() {
        setData(
            fileList.map((file,i) => ({
                "key": file.uid, 
                "file": file.name,
                "uploaded_file": getUserFileForOrgFile("name", file.uid),
                "status": getUserFileForOrgFile("status", file.uid)
            }))
        );
    }

    const handleFilter = key => {
        const selected = parseInt(key);
        if (selected === 4) {
            data = getAllData()
        }
    
        const statusMap = {
          1: "Incomplete",
          2: "Pending Approval",
          3: "Complete"
        };
    
        const selectedStatus = statusMap[selected];
    
        const filteredData = data.filter(
          ({ status }) => status === selectedStatus
        );
        setData(filteredData)
      };

    return (
        <div>
            <header style={{float: 'right'}}>
                <StatusFilter
                    filterBy={handleFilter}
                />
            </header>
            <Table columns={columns} dataSource={data}/>
        </div>
    );
};
export default UserFilesTable;