"use client"

import socket from "@/app/SocketConnection/SocketConnection";
import { Dialog, DialogContent } from "@mui/material";
import { useFormik } from "formik";

export const UpdateGroupDetails = ({ open, handleClose, Details, id }) => {
    const formik = useFormik({
        initialValues: {
            GroupId : Details.id,
            GroupName: Details.name,
            GroupDescription: Details.description,
        },
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            socket.emit('UpdateGroupDetails', values)
        },
    });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent className="!p-6">
                <h2 className="text-xl font-bold mb-4 text-center text-amber-600">Update Group Details</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="GroupName" className="block text-sm font-medium text-gray-700 mb-1">
                            Group Name
                        </label>
                        <input
                            id="GroupName"
                            name="GroupName"
                            type="text"
                            value={formik.values.GroupName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter group name"
                        />
                    </div>

                    <div>
                        <label htmlFor="GroupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Group Description
                        </label>
                        <textarea
                            id="GroupDescription"
                            name="GroupDescription"
                            rows="4"
                            value={formik.values.GroupDescription}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

