"use client";

import { GetUserProfileData } from "@/Redux/features/UserProfileSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Tabs,
    Tab,
    CircularProgress,
    Container,
} from "@mui/material";
import UserFollowers from "@/Components/ProfilePageComponents/UserFollowers";
import UserFollowing from "@/Components/ProfilePageComponents/UserFollowing";
import { useParams } from "next/navigation";
import { GetFollowerAndFollowingData, GetSingleUser } from "@/Redux/features/UserSlice";

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box p={2}>{children}</Box>}
        </div>
    );
}

const UserFriends = () => {
    const { id } = useParams()
    const [userid, setUserid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const Followers = useSelector((state) => state.UserReducer.FollowersData)
    const Following = useSelector((state) => state.UserReducer.FollowingData)
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("AccessToken");
        try {
            const decode = jwtDecode(token);
            setUserid(decode.id);
            dispatch(GetFollowerAndFollowingData({ id }));
        } catch (error) {
            console.error("Invalid token:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (loading || !userid) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                sx={{ mb: 2 }}
            >
                <Tab label="Followers" />
                <Tab label="Following" />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <UserFollowers userid={userid} UserFollowers={Followers} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <UserFollowing userid={userid} UserFollowing={Following} />
            </TabPanel>
        </Container>
    );
};

export default UserFriends;
