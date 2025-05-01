"use client";

import ProfileData from "@/Components/ProfilePageComponents/ProfileData";
import UserPostsData from "@/Components/ProfilePageComponents/UserPostsDataComponent";
import { GetUserProfileData, UpdateUploadStatus } from "@/Redux/features/UserProfileSlice";
import { Container, Tab, Tabs } from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPhotoLibrary, MdVisibilityOff } from "react-icons/md";
import UserHiddenPostsData from "@/Components/ProfilePageComponents/HiddenPostComponent";

// TabPanel component
const TabPanel = ({ children, value, index }) => {
  return value === index ? <div>{children}</div> : null;
};

const ProfilePage = () => {
  const [userid, setUserid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();

  const UserPosts = useSelector((state) => state.UserProfileSlice.UserImagesUploadData);
  const UploadStatus = useSelector((state) => state.UserProfileSlice.PostUploadStatus);
  const UserData = useSelector((state) => state.UserProfileSlice.UserDetails);
  const HiddenPostsData = useSelector((state) => state.UserProfileSlice.HiddenPosts);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (UploadStatus === "success") {
      dispatch(UpdateUploadStatus());
    }
  }, [UploadStatus]);

  useEffect(() => {
    const Token = Cookies.get("AccessToken");
    if (Token) {
      try {
        const decode = jwtDecode(Token);
        setUserid(decode.id);
        dispatch(GetUserProfileData({ userid: decode.id }));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading || !userid) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      <ProfileData userid={userid} UserData={UserData} />

      <Container maxWidth="sm">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab
            icon={<MdPhotoLibrary size={20} />}
            label="User Posts"
            iconPosition="start"
          />
          <Tab
            icon={<MdVisibilityOff size={20} />}
            label="Hidden Posts"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <UserPostsData userid={userid} UserPosts={UserPosts} />
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <UserHiddenPostsData userid={userid} UserPosts={HiddenPostsData} />
        </TabPanel>
      </Container>
    </div>
  );
};

export default ProfilePage;
