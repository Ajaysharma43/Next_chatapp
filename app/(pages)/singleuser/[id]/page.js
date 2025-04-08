"use client";
import { AddFriends, GetSingleUser, AcceptRequest , DeclineRequest } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
                console.log(senderid , currentUserId)
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        };

        fetchUser();
    }, [id, dispatch]);

    const handleSendFriendRequest = () => {
        console.log(senderid , currentUserId)
        dispatch(AddFriends({data}));
    };


    if (IsUserSearchLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-lg font-semibold text-blue-600 animate-pulse">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="p-6 max-w-lg w-full mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    {currentUserId == id ? "Your Profile" : "User Profile"}
                </h1>

                {SingleUserData ? (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 text-center">{SingleUserData.name}</h2>
                        {currentUserId == id ? (
                            <>
                                <p className="text-gray-600"><strong>Email:</strong> {SingleUserData.email}</p>
                                <p className="text-gray-600"><strong>Phone:</strong> {SingleUserData.phone}</p>
                                <p className="text-gray-600"><strong>City:</strong> {SingleUserData.city}</p>
                                <p className="text-gray-600"><strong>Country:</strong> {SingleUserData.country}</p>
                                <p className="text-gray-600"><strong>Street:</strong> {SingleUserData.street}</p>
                                <p className="text-gray-600"><strong>Postal Code:</strong> {SingleUserData.postal_code}</p>
                                <p className="text-gray-600"><strong>Role:</strong> {SingleUserData.roles}</p>
                                <p className="text-gray-600"><strong>Account Created:</strong> {new Date(SingleUserData.created_at).toLocaleString()}</p>
                                <p className="text-green-600 font-semibold mt-2 text-center">This is your profile</p>
                            </>
                        ) : (
                            <div className="mt-4">
                                {IsUserFriends ? (
                                    <div className="flex items-center justify-center gap-2">
                                        {UsersRelation === "request_sent" ? (
                                            <div>
                                                {senderid == currentUserId ? (
                                                    <button
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md cursor-not-allowed"
                                                        disabled
                                                    >
                                                        Request Sent ✅
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-4 mt-4">
                                                        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                                                        onClick={() => dispatch(AcceptRequest({data}))}>
                                                            Accept
                                                        </button>
                                                        <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                                                        onClick={() => dispatch(DeclineRequest({data}))}>
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                                                Friends
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex gap-2 justify-center">
                                        {UsersRelation === "request_received" ? (
                                            <button
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                                            >
                                                Accept Request ✅
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                                                onClick={handleSendFriendRequest}
                                            >
                                                Send Friend Request
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <h2 className="text-gray-500 text-center">No user found</h2>
                )}
            </div>
        </div>
    );
};

export default SingleUser;
