"use client";
import { SwipeableDrawer } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { LuSend } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { AddComment, DeleteComment } from "@/Redux/features/UserProfileSlice";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { useState } from "react";

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
};

export const CommentsDrawer = ({ open, onClose, dispatch, imageid, userid }) => {
    const [deletedrawer , setdeletedrawer] = useState(false)
    const [DeleteCommentId , setDeleteCommentID] = useState(null)
    const comments = useSelector((state) => state.UserProfileSlice.ImageComments);
    const formik = useFormik({
        initialValues: {
            comment: ""
        },
        onSubmit: (values, { resetForm }) => {
            dispatch(AddComment({ values, imageid, userid }));
            resetForm();
        }
    });

    const HandleDeleteDrawer = (comment) => {
        if(deletedrawer == false)
        {
            setDeleteCommentID(comment.id)
            setdeletedrawer(true)
        }
        else
        {
            setDeleteCommentID(null)
            setdeletedrawer(false)
        }
    }

    const DeleteSelectedComment = async () => {
        await dispatch(DeleteComment({commentid : DeleteCommentId , imageid : imageid}))
        HandleDeleteDrawer()
    }

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            PaperProps={{
                className: "rounded-t-3xl bg-white",
            }}
        >
            {/* Puller */}
            <div className="w-full flex justify-center py-3">
                <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="text-center pb-4">
                <h1 className="text-lg font-bold text-gray-800">Comments</h1>
            </div>

            {/* Comments Section */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">
                {comments && comments.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-6">
                            {comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-4 relative">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {comment.profilepic ? (
                                            <Image
                                                src={comment.profilepic}
                                                height={44}
                                                width={44}
                                                alt="Profile pic"
                                                className="rounded-full object-cover w-10 h-10"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold uppercase">
                                                {comment.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Comment Content */} 
                                    <div className="flex flex-col bg-gray-100 p-3 rounded-2xl w-full rounded-tl-none relative">
                                        <div className="flex items-center justify-between mb-1">
                                            <h1 className="text-sm font-semibold text-gray-800">{comment.name}</h1>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] text-gray-500">{formatDate(comment.created_at)}</p>
                                                {userid === comment.user_id && (
                                                    <button className="text-gray-400 hover:text-red-500 text-lg"
                                                    onClick={() => HandleDeleteDrawer(comment)}>
                                                        <MdDelete />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        No comments yet.
                    </div>
                )}

                {/* Add Comment */}
                <form action="" onSubmit={formik.handleSubmit} className="flex gap-1 mt-2">
                    <textarea
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        placeholder="Enter your comment"
                        className="w-full rounded-lg focus:outline-none text-sm text-gray-700"
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 bg-blue-400 flex justify-center items-center rounded-full text-white transition-all duration-300 hover:text-black hover:bg-blue-500"
                    >
                        <LuSend />
                    </button>
                </form>
            </div>
            <DeleteCommentDialog open={deletedrawer} onclose={HandleDeleteDrawer} onDelete={DeleteSelectedComment}/>
        </SwipeableDrawer>
    );
};
