"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Users } from "lucide-react";
import { TiDelete } from "react-icons/ti";
import socket from "@/app/SocketConnection/SocketConnection";
import { ChatGroups, GetGroups } from "@/Redux/features/ChatGroupsSlice";
import DeleteDialog from "./Dialogs/DeleteGroupDialog";
import Link from "next/link";

const GroupsData = () => {
    const [userid, setUserId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

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

    const openDeleteDialog = (groupId) => {
        setSelectedGroupId(groupId);
        setOpenDialog(true);
    };

    const closeDeleteDialog = () => {
        setOpenDialog(false);
        setSelectedGroupId(null);
    };

    const confirmDelete = (groupId) => {
        console.log("Confirmed delete for:", groupId);
        socket.emit("DeleteGroup", groupId, userid);
        closeDeleteDialog();
    };

    return (
        <>
            <div className="p-4 sm:p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-amber-600">
                    Your Chat Groups
                </h1>

                {Groups.length === 0 ? (
                    <div className="text-center text-gray-500">No Groups available</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Groups.map((group) => (
                            <div key={group?.id} className="relative">
                                <Link href={`/groupchat/${group.id}/${group.created_by}`}>
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition-all duration-300 border border-gray-100 relative">

                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                                                <Users size={20} />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {group?.name}
                                            </h2>
                                        </div>

                                        {group?.description && (
                                            <p className="text-sm text-gray-600 pl-10">
                                                {group?.description}
                                            </p>
                                        )}

                                        {group?.created_by == userid && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    openDeleteDialog(group?.id);
                                                }}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                                                title="Delete Group"
                                            >
                                                <TiDelete size={22} />
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteDialog
                open={openDialog}
                onClose={closeDeleteDialog}
                groupId={selectedGroupId}
                onConfirm={confirmDelete}
            />
        </>
    );
};

export default GroupsData;
