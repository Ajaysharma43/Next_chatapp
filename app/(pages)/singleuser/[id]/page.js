"use client";
import {
  AddFriends,
  GetSingleUser,
  AcceptRequest,
  DeclineRequest,
} from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ProfilePage from "../../profile/page";
import SingleProfileData from "@/Components/SingleUserComponents/Profile";
import SingleUserPostsData from "@/Components/SingleUserComponents/Uploads";

const SingleUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [data, setData] = useState({ sender: "", receiver: "" });

  const SingleUserData = useSelector((state) => state.UserReducer.SingleUser);
  const UsersRelation = useSelector((state) => state.UserReducer.UsersRelation);
  const IsUserFriends = useSelector((state) => state.UserReducer.IsUserFriends);
  const ImagesData = useSelector((state) => state.UserReducer.ImagesData);
  const IsUserSearchLoading = useSelector(
    (state) => state.UserReducer.IsUserSearchLoading
  );
  const senderid = useSelector((state) => state.UserReducer.senderid);

  const Userdata = [SingleUserData];

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    try {
      const decode = jwtDecode(token);
      setCurrentUserId(decode.id);
      setData({ sender: decode.id, receiver: parseInt(id) });
      dispatch(GetSingleUser({ id, currentUserId: decode.id }));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [id, dispatch]);

  const handleSendFriendRequest = () => {
    dispatch(AddFriends({ data }));
  };

  if (IsUserSearchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-lg font-semibold text-blue-600 animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  if (currentUserId == id) {
    return <ProfilePage />;
  }

  return (
    <div className="min-h-screen bg-white text-black w-full px-4 md:px-10 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {SingleUserData ? (
          <>
            {/* Profile Section with Action Buttons */}
            <SingleProfileData
              UserData={Userdata}
              buttons={
                <div className="flex gap-4 flex-wrap justify-center md:justify-start mt-4">
                  {IsUserFriends ? (
                    UsersRelation === "request_sent" ? (
                      senderid == currentUserId ? (
                        <button
                          className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md font-medium shadow-sm cursor-not-allowed"
                          disabled
                        >
                          Request Sent
                        </button>
                      ) : (
                        <>
                          <motion.button
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium shadow-md"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch(AcceptRequest({ data }))}
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium shadow-md"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch(DeclineRequest({ data }))}
                          >
                            Reject
                          </motion.button>
                        </>
                      )
                    ) : (
                      <button className="bg-black text-white px-5 py-2 rounded-md font-medium shadow">
                        Friends 👥
                      </button>
                    )
                  ) : UsersRelation === "request_received" ? (
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium shadow-md"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch(AcceptRequest({ data }))}
                    >
                      Accept Request ✅
                    </motion.button>
                  ) : (
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow-md"
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendFriendRequest}
                    >
                      Send Friend Request
                    </motion.button>
                  )}
                </div>
              }
            />

            {/* Posts Section */}
            <div className="mt-8">
              <SingleUserPostsData UserPosts={ImagesData} id={id}/>
            </div>
          </>
        ) : (
          <h2 className="text-center text-gray-500 mt-6">No user found</h2>
        )}
      </motion.div>
    </div>
  );
};

export default SingleUser;
