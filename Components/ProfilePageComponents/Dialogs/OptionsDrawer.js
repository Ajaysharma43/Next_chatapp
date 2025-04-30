"use client"
import { SwipeableDrawer } from "@mui/material";
import { HiOutlineTrash, HiOutlinePencil, HiOutlineDownload, HiOutlineEye } from "react-icons/hi";
import ViewImage from "./ViewImageDrawer";
import { useState } from "react";

const OptionsDrawer = ({ open, onClose, dispatch, imageid, userid, imageurl }) => {
    const [ViewDialog, setViewDialog] = useState(null)

    console.log(imageurl)
    const handleDelete = () => {
        console.log("Delete action for image ID:", imageid);
        // dispatch(deleteImage({ imageid, userid }))
    };

    const handleEdit = () => {
        console.log("Edit action");
    };

    const handleDownload = () => {
        console.log("Download action");
    };

    const handleView = () => {
        if (ViewDialog == true) {
            setViewDialog(false)
        }
        else {
            setViewDialog(true)
        }
    };

    const options = [
        { label: "View Image", icon: <HiOutlineEye />, onClick: handleView },
        { label: "Download", icon: <HiOutlineDownload />, onClick: handleDownload },
        { label: "Delete Post", icon: <HiOutlineTrash />, onClick: handleDelete, color: "text-red-600" },
    ];

    return (
        <>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={() => { }}
                PaperProps={{
                    className: "rounded-t-3xl bg-white",
                }}
            >
                <div className="w-full flex justify-center py-3">
                    <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="px-4 pb-6">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={option.onClick}
                            className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition ${option.color || "text-gray-800"}`}
                        >
                            <span className="text-xl">{option.icon}</span>
                            <span className="text-base font-medium">{option.label}</span>
                        </button>
                    ))}
                </div>
            </SwipeableDrawer>
            <ViewImage open={ViewDialog} onclose={handleView} image={imageurl} />
        </>
    );
};

export default OptionsDrawer;
