"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@mui/material";
import { CheckFriends } from "@/Redux/features/UserSlice";
import socket from "@/app/SocketConnection/SocketConnection";

export const CreateGroupDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
    const friends = useSelector((state) => state.UserReducer.Friends);
    const [userId, setUserId] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Decode user ID from token and fetch friends
    useEffect(() => {
        try {
            const token = Cookies.get("AccessToken");
            const decoded = jwtDecode(token);
            const id = decoded.id;
            setUserId(id);
            dispatch(CheckFriends({ id, data: onlineUsers }));
        } catch (error) {
            console.error(error);
        }
    }, [dispatch, onlineUsers]);

    // Map friend list to always return "other" user
    useEffect(() => {
        const list = friends
            .filter((f) => !f.is_blocked)
            .map((entry) => {
                const isSender = entry.sender_id === userId;
                return {
                    id: isSender ? entry.receiver_id : entry.sender_id,
                    name: isSender ? entry.receiver_name : entry.sender_name,
                    email: isSender ? entry.receiver_email : entry.sender_email,
                };
            });
        setFriendsList(list);
    }, [friends, userId]);

    const formik = useFormik({
        initialValues: {
            GroupName: "",
            Description: "",
        },
        onSubmit: (values, { resetForm }) => {
            const groupData = {
                ...values,
                members: selectedMembers,
                createdBy: userId,
            };
            console.log("Creating group:", groupData);
            socket.emit('CreateGroup' , groupData)
            resetForm()
            setSelectedMembers([])
            // Optionally call an API to create group here
            // onClose();
        },
    });

    const handleCheckboxChange = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id)
                ? prev.filter((memberId) => memberId !== id)
                : [...prev, id]
        );
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent className="w-full max-w-[90vw] sm:max-w-[400px] px-2 sm:px-4">
                <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
                    Create a New Chat Group
                </h2>
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="GroupName" className="text-sm font-medium mb-1">
                            Group Name
                        </label>
                        <input
                            type="text"
                            name="GroupName"
                            id="GroupName"
                            value={formik.values.GroupName}
                            onChange={formik.handleChange}
                            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter group name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="Description" className="text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            name="Description"
                            id="Description"
                            value={formik.values.Description}
                            onChange={formik.handleChange}
                            rows={3}
                            className="border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter a short description"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Add Members</label>
                        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                            {friendsList.length === 0 ? (
                                <p className="text-sm text-gray-500">No friends found.</p>
                            ) : (
                                friendsList.map((friend) => (
                                    <label key={friend.id} className="flex items-center gap-2 text-sm py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(friend.id)}
                                            onChange={() => handleCheckboxChange(friend.id)}
                                            className="accent-amber-500"
                                        />
                                        <span>{friend.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md text-sm bg-amber-500 text-white hover:bg-amber-600 transition"
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
