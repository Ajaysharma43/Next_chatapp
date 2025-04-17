"use client"

import socket from "@/app/SocketConnection/SocketConnection"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
} from "@mui/material"

export const AddMemberDialog = ({ open, onclose, userId, group_id, username }) => {
    const [friends, setFriends] = useState([])
    const [selectedIds, setSelectedIds] = useState([])

    useEffect(() => {
        if (!open) return

        setSelectedIds([])

        socket.on("SendFriendsToAdd", (Friends) => {
            setFriends(Friends)
        })

        return () => {
            socket.off("SendFriendsToAdd")
        }
    }, [open])

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = selectedIds.map((id) => ({
            user_id: id,
            group_id,
        }))

        socket.emit("AddFriendsToGroup", payload, userId, group_id, username)
        onclose()
    }

    return (
        <Dialog open={open} onClose={onclose} fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Select friends to add</DialogTitle>

                <DialogContent dividers>
                    {friends.length === 0 ? (
                        <div className="grid gap-2">
                            <h1 className="text-center text-gray-500">No friends remained to add in the group</h1>
                            <button
                            type="button"
                            onClick={onclose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {friends.map((friend) => {
                                const isSender = friend.sender_id === userId
                                const otherUserId = isSender ? friend.receiver_id : friend.sender_id
                                const otherUserName = isSender ? friend.receiver_name : friend.sender_name

                                return (
                                    <label
                                        key={otherUserId}
                                        className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(otherUserId)}
                                            onChange={() => handleToggle(otherUserId)}
                                            className="w-4 h-4"
                                        />
                                        <span>{otherUserName}</span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </DialogContent>

                {friends.length > 0 && (
                    <DialogActions>
                        <button
                            type="button"
                            onClick={onclose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={selectedIds.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            Add Selected
                        </button>
                    </DialogActions>
                )}
            </form>
        </Dialog>
    )
}
