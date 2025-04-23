"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { useEffect, useState } from "react";
import { Users, Info, CalendarDays, UserCircle, ShieldCheck } from "lucide-react";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlinePersonRemove } from "react-icons/md";
import { UpdateGroupDetails } from "./Dialogs/UpdateGroupDetails";
import { RemoveUserFromGroup } from "./Dialogs/RemoveUserDialog";
import { AddMemberDialog } from "./Dialogs/AddMembersDialog";
import { useDispatch } from "react-redux";
import { GetGroups } from "@/Redux/features/ChatGroupsSlice";
import UpdateGroupRoleDialog from "./Dialogs/UpdateGroupRole";

const GroupDetails = ({ id, userid, username, onBack }) => {
    const [groupDetails, setGroupDetails] = useState({});
    const [membersDetails, setMembersDetails] = useState([]);
    const [GroupRole, SetGroupRole] = useState('')
    const [UpdateDialog, setUpdatedialog] = useState(false)
    const [RemoveUser, setRemoveUser] = useState([])
    const [RemoveDialog, setRemoveDialog] = useState(false)
    const [AddDialog, setAddDialog] = useState(false)
    const dispatch = useDispatch()

    const handleGroupDetails = (GetGroupDetails, GetMembersDetails) => {
        console.log(userid, groupDetails.created_by)
        const includesCurrentUser = GetMembersDetails.some(member => member.user_id == userid);
        // Allow if user is group creator (admin) or present in member list
        if (!includesCurrentUser && userid != GetGroupDetails[0].created_by) {
            dispatch(GetGroups({ userid }))
            onBack()
        }
        setGroupDetails(GetGroupDetails[0]); 
        setMembersDetails(GetMembersDetails);
        if (userid != GetGroupDetails[0].created_by) {
            const FindUser = GetMembersDetails.find((user) => user.user_id == userid)
            SetGroupRole(FindUser.role)
        }
        setRemoveDialog(false)
    };

    useEffect(() => {
        if (!id) return;

        socket.emit("GetGroupDetails", id);



        socket.on("SendGroupDetails", handleGroupDetails);

        socket.on('UpdatedGroupDetails', (Update, values) => {
            if (values.GroupId == id) {
                setGroupDetails(Update[0])
                setUpdatedialog(false)
            }
        })

        socket.on('SentNewMembersOfTheGroup', (GetMembersDetail, group_id) => {
            if (id == group_id) {
                dispatch(GetGroups({ userid }))
                setMembersDetails(GetMembersDetail);
                setAddDialog(false);
            }
        });


        return () => {
            socket.off("SendGroupDetails", handleGroupDetails);
            socket.off('SentNewMembersOfTheGroup')
        };
    }, [id]);

    const HandleUpdateDialog = () => {
        if (UpdateDialog == true) {
            setUpdatedialog(false)
        }
        else {
            setUpdatedialog(true)
        }
    }

    const HandleRemoveDilog = (member) => {
        if (RemoveDialog == true) {
            setRemoveDialog(false)
            setRemoveUser([])
        }
        else {
            setRemoveUser(member)
            setRemoveDialog(true)
        }
    }

    const HandleAddDialog = () => {
        if (AddDialog == true) {
            setAddDialog(false)
        }
        else {
            socket.emit('GetFriendsToAdd', userid, id)
            setAddDialog(true)
        }
    }

    return (
        <>
            <UpdateGroupDetails open={UpdateDialog} handleClose={HandleUpdateDialog} Details={groupDetails} id={userid} username={username} />
            <RemoveUserFromGroup open={RemoveDialog} onClose={HandleRemoveDilog} userDetails={RemoveUser} username={username} id={userid} />
            <AddMemberDialog open={AddDialog} onclose={HandleAddDialog} userId={userid} group_id={id} username={username} />
            <UpdateGroupRoleDialog/>
            <div className="p-5 bg-white shadow-xl rounded-2xl mt-4 w-full max-w-2xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-600">
                        <Info size={22} />
                        Group Info
                    </h2>
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                            <Users size={18} className="text-gray-500" />
                            <span className="font-semibold">Name:</span> {groupDetails.name}
                        </p>
                        <p className="flex items-center gap-2">
                            <Info size={18} className="text-gray-500" />
                            <span className="font-semibold">Description:</span> {groupDetails.description}
                        </p>
                        <p className="flex items-center gap-2">
                            <CalendarDays size={18} className="text-gray-500" />
                            <span className="font-semibold">Created At:</span> {new Date(groupDetails.created_at).toLocaleString()}
                        </p>
                        <p className="flex items-center gap-2">
                            <UserCircle size={18} className="text-gray-500" />
                            <span className="font-semibold">Created By :</span> {groupDetails.username}
                        </p>
                        {
                            userid == groupDetails.created_by || GroupRole == 'EDITOR' && (
                                <>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="bg-blue-600 rounded-lg uppercase text-white p-2 transition-all duration-200 hover:bg-blue-800"
                                            onClick={HandleUpdateDialog}>Update details</button>
                                        <button className="bg-teal-600 rounded-lg uppercase text-white p-2 transition-all duration-200 hover:bg-teal-800"
                                            onClick={HandleAddDialog}>Add members</button>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-3 text-amber-600">
                        <Users size={22} />
                        Members
                    </h3>
                    <ul className="space-y-3">
                        {membersDetails.map((member) => (
                            <li key={member.id} className="p-3 bg-gray-100 rounded-xl shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-gray-700 text-sm">
                                        <p className="flex items-center gap-2">
                                            <UserCircle size={16} className="text-gray-500" />
                                            <span className="font-medium">Name:</span> {member.name}
                                        </p>
                                        <p className="flex items-center gap-2 mt-1">
                                            <ShieldCheck size={16} className="text-gray-500" />
                                            <span className="font-medium">Role:</span> {member.role}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 sm:mt-0 sm:text-right">
                                        <CalendarDays size={14} className="inline-block mr-1" />
                                        Joined: {new Date(member.joined_at).toLocaleString()}
                                    </div>
                                    {
                                        userid == groupDetails.created_by && (
                                            <div>
                                                <button
                                                    title="Remove Member"
                                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200 text-red-600 hover:text-red-800"
                                                    onClick={() => HandleRemoveDilog(member)}
                                                >
                                                    <MdOutlinePersonRemove size={20} />
                                                </button>
                                                <button
                                                    title="Edit Role"
                                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200 text-blue-600 hover:text-red-800"
                                                >
                                                    <FaUserEdit size={20} />
                                                </button>

                                            </div>
                                        )
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default GroupDetails;
