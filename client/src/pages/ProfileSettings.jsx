import React, {useState, useEffect} from 'react';
import axiosAPI from "../api/axiosApi";

function ProfileSettings() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
     }, [])

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        const url = `users/get/?user_id=${userId}`;
        const response = await axiosAPI.get(url);
        setUser(response.data.user);
    }

    return <h1>Profile settings!</h1>;
}

export default ProfileSettings;