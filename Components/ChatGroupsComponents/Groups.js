"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Users } from "lucide-react";
import { TiDelete } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import socket from "@/app/SocketConnection/SocketConnection";
import { ChatGroups, GetGroups } from "@/Redux/features/ChatGroupsSlice";
import DeleteDialog from "./Dialogs/DeleteGroupDialog";
import ChatArea from "./ChatArea";

const GroupsData = () => {
    const [userid, setUserId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedCreatedBy, setSelectedCreatedBy] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const Groups = useSelector((state) => state.ChatGroupsReducer.Groups);
    const dispatch = useDispatch();

    // Check if screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

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
            setSelectedGroupId(null)
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
        socket.emit("DeleteGroup", groupId, userid);
        closeDeleteDialog();
    };

    const handleGroupClick = (groupId, createdBy) => {
        setSelectedGroupId(groupId);
        setSelectedCreatedBy(createdBy);
        setShowChat(true);
    };

    const handleBackToGroups = () => {
        setShowChat(false);
    };

    const slideVariants = {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
    };

    const reverseSlideVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
    };

    return (
        <>
            <article className="flex flex-col lg:flex-row h-[calc(100vh-100px)] overflow-hidden relative">
                {/* Group List */}
                {isMobile ? (
                    <AnimatePresence mode="wait">
                        {!showChat && (
                            <motion.section
                                key="groupList"
                                variants={reverseSlideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute lg:static w-full lg:w-1/3 h-full overflow-y-auto p-4 border-r border-gray-200 bg-gray-50 z-10"
                            >
                                {Groups.length === 0 ? (
                                    <div className="text-center text-gray-500">No Groups available</div>
                                ) : (
                                    <div className="grid gap-4">
                                        {Groups.map((group) => (
                                            <div
                                                key={group?.id}
                                                className={`relative cursor-pointer ${group?.id === selectedGroupId
                                                        ? "bg-amber-200" // active group background
                                                        : "bg-white"
                                                    } rounded-xl shadow-md hover:shadow-lg p-5 transition-all duration-300 border border-gray-100 relative`}
                                                onClick={() => handleGroupClick(group.id, group.created_by)}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                                                        <Users size={20} />
                                                    </div>
                                                    <h2 className="text-lg font-semibold text-gray-800">
                                                        {group?.name}
                                                    </h2>
                                                </div>
                                                {group?.description && (
                                                    <p className="text-sm text-gray-600 pl-10">{group?.description}</p>
                                                )}
                                                {group?.created_by == userid && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteDialog(group?.id);
                                                        }}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                                                        title="Delete Group"
                                                    >
                                                        <TiDelete size={22} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                ) : (
                    <section className="w-full lg:w-1/3 h-full overflow-y-auto p-4 border-r border-gray-200 bg-gray-50">
                        {Groups.length === 0 ? (
                            <div className="text-center text-gray-500">No Groups available</div>
                        ) : (
                            <div className="grid gap-4">
                                {Groups.map((group) => (
                                    <div
                                        key={group?.id}
                                        className={`relative cursor-pointer ${group?.id === selectedGroupId
                                                ? "bg-amber-200" // active group background
                                                : "bg-white"
                                            } rounded-xl shadow-md hover:shadow-lg p-5 transition-all duration-300 border border-gray-100 relative`}
                                        onClick={() => handleGroupClick(group.id, group.created_by)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                                                <Users size={20} />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800">{group?.name}</h2>
                                        </div>
                                        {group?.description && (
                                            <p className="text-sm text-gray-600 pl-10">{group?.description}</p>
                                        )}
                                        {group?.created_by == userid && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteDialog(group?.id);
                                                }}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                                                title="Delete Group"
                                            >
                                                <TiDelete size={22} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Chat Area */}
                {isMobile ? (
                    <AnimatePresence mode="wait">
                        {showChat && (
                            <motion.section
                                key="chatArea"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute lg:static w-full lg:w-2/3 h-full overflow-y-auto p-4 bg-white z-10"
                            >
                                {selectedGroupId ? (
                                    <ChatArea
                                        id={selectedGroupId}
                                        createdby={selectedCreatedBy}
                                        onBack={handleBackToGroups}
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 mt-10">
                                        Select a group to start chatting
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                ) : (
                    <section className="w-full lg:w-2/3 h-full overflow-y-auto p-4 bg-white">
                        {selectedGroupId ? (
                            <ChatArea
                                id={selectedGroupId}
                                createdby={selectedCreatedBy}
                                onBack={handleBackToGroups}
                            />
                        ) : (
                            <div className="text-center text-gray-400 mt-10">
                                Select a group to start chatting
                            </div>
                        )}
                    </section>
                )}
            </article>

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
