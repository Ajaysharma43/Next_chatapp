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
import Image from "next/image";

const SingleUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [data, setData] = useState({ sender: "", receiver: "" });

  const SingleUserData = useSelector((state) => state.UserReducer.SingleUser);
  const UsersRelation = useSelector((state) => state.UserReducer.UsersRelation);
  const IsUserFriends = useSelector((state) => state.UserReducer.IsUserFriends);
  const IsUserSearchLoading = useSelector((state) => state.UserReducer.IsUserSearchLoading);
  const senderid = useSelector((state) => state.UserReducer.senderid);

  useEffect(() => {
    const fetchUser = () => {
      const token = Cookies.get("AccessToken");

      try {
        const decode = jwtDecode(token);
        setCurrentUserId(decode.id);
        setData({ sender: decode.id, receiver: parseInt(id) });
        dispatch(GetSingleUser({ id, currentUserId: decode.id }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUser();
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {currentUserId == id ? "Your Profile" : "User Profile"}
        </h1>

        {SingleUserData ? (
          <motion.div
            className="bg-gray-50 rounded-xl p-6 space-y-6 shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg bg-gray-200">
                {SingleUserData.profilepic ? (
                  <Image
                    src={SingleUserData.profilepic}
                    alt={SingleUserData.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-semibold bg-gray-500">
                    {SingleUserData.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{SingleUserData.name}</h2>
              {currentUserId == id && (
                <p className="text-gray-500">{SingleUserData.email}</p>
              )}
            </div>

            {/* User Info */}
            {currentUserId == id ? (
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>Phone:</strong> {SingleUserData.phone}</p>
                <p><strong>City:</strong> {SingleUserData.city}</p>
                <p><strong>Country:</strong> {SingleUserData.country}</p>
                <p><strong>Street:</strong> {SingleUserData.street}</p>
                <p><strong>Postal Code:</strong> {SingleUserData.postal_code}</p>
                <p><strong>Role:</strong> {SingleUserData.roles}</p>
                <p><strong>Created:</strong> {new Date(SingleUserData.created_at).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-2">
                Only limited details are visible.
              </p>
            )}

            {/* Friend Action Buttons */}
            {currentUserId == id ? (
              <p className="text-green-600 font-semibold text-center mt-4">
                This is your profile.
              </p>
            ) : (
              <div className="flex justify-center mt-6">
                {IsUserFriends ? (
                  UsersRelation === "request_sent" ? (
                    senderid == currentUserId ? (
                      <button
                        className="bg-yellow-400 text-white px-5 py-2 rounded-xl font-medium shadow-sm cursor-not-allowed"
                        disabled
                      >
                        Request Sent ✅
                      </button>
                    ) : (
                      <div className="flex gap-4">
                        <motion.button
                          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-medium shadow-md"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => dispatch(AcceptRequest({ data }))}
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium shadow-md"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => dispatch(DeclineRequest({ data }))}
                        >
                          Reject
                        </motion.button>
                      </div>
                    )
                  ) : (
                    <div className="flex gap-2">
                      <button className="bg-green-600 text-white px-5 py-2 rounded-xl font-medium shadow">
                        Friends 👥
                      </button>
                      <button className="bg-green-600 text-white px-5 py-2 rounded-xl font-medium shadow">
                        Chat 💬
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex gap-2 justify-center">
                    {UsersRelation === "request_received" ? (
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-medium shadow-md"
                      >
                        Accept Request ✅
                      </button>
                    ) : (
                      <motion.button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium shadow-md"
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendFriendRequest}
                      >
                        Send Friend Request
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <h2 className="text-center text-gray-500 mt-6">No user found</h2>
        )}
      </motion.div>
    </div>
  );
};

export default SingleUser;
