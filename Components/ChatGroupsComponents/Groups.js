"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Users } from "lucide-react"; // Icon for group logo

import socket from "@/app/SocketConnection/SocketConnection";
import { ChatGroups, GetGroups } from "@/Redux/features/ChatGroupsSlice";

const GroupsData = () => {
    const [userid, setUserId] = useState(null);
    const Groups = useSelector((state) => state.ChatGroupsReducer.Groups);
    const dispatch = useDispatch();

    useEffect(() => {
        const GetData = async () => {
            const token = Cookies.get("AccessToken");
            const decode = jwtDecode(token);
            setUserId(decode.id);
            await dispatch(GetGroups({ userid: decode.id }));
        };
        GetData();
    }, [Groups.length]);

    useEffect(() => {
        socket.on("SendGroups", (GetGroups) => {
            dispatch(ChatGroups(GetGroups));
        });
    }, [dispatch]);

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-amber-600">
                Your Chat Groups
            </h1>

            {Groups.length === 0 ? (
                <div className="text-center text-gray-500">No Groups available</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Groups.map((group) => (
                        <div
                            key={group?.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                                    <Users size={20} />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">{group?.name}</h2>
                            </div>
                            {group?.description && (
                                <p className="text-sm text-gray-600 pl-10">
                                    {group?.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupsData;
