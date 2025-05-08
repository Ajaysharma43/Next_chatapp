"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { GetRequests } from "@/Redux/features/UserSlice";

import SentRequests from "./(UserRequests)/SendRequest";
import ReceivedRequests from "./(UserRequests)/RecieveRequests";

import { Tabs, Tab, Box } from "@mui/material";

const Contact = () => {
    const [userId, setUserId] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const dispatch = useDispatch();
    const Requests = useSelector((state) => state.UserReducer.Requests);
    const RecieveRequests = useSelector((state) => state.UserReducer.RecieveRequests);
    const IsUserFriends = useSelector((state) => state.UserReducer.IsUserFriends);

    useEffect(() => {
        const GetUserRequests = () => {
            const Token = Cookies.get("AccessToken");
            const Decode = jwtDecode(Token);
            setUserId(Decode.id);
            dispatch(GetRequests({ senderid: Decode.id }));
        };
        GetUserRequests();
    }, [dispatch, IsUserFriends]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-6">

            <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, mb: 6 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    <Tab label="Sent Requests" />
                    <Tab label="Received Requests" />
                </Tabs>
            </Box>

            <div>
                {tabIndex === 0 && <SentRequests requests={Requests} userId={userId} />}
                {tabIndex === 1 && <ReceivedRequests requests={RecieveRequests} userId={userId} />}
            </div>
        </div>
    );
};

export default Contact;
