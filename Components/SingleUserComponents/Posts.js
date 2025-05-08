"use client";

import { useState, useEffect } from "react";
import { UserProfileInstance } from "@/Interseptors/UserProfileInterseptors";
import Image from "next/image";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { GetComments } from "@/Redux/features/UserProfileSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CommentsDrawer } from "../ProfilePageComponents/Dialogs/CommentsDrawer";


const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
};

const SingleUserPostsComponent = ({ userid, Userposts, UserProfile }) => {
    const [posts, setPosts] = useState([]);
    const [CommentsDrawerState, setCommentsDrawerState] = useState(false)
    const [OptionsDrawerstate, setOptionsDrawerstate] = useState(false)
    const [IsPostHidden , setIsPostHidden] = useState(false)
    const [imageid, setimageid] = useState(null)
    const [imageUrl , setimageurl] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        setPosts(Userposts);
    }, [Userposts]);

    const HandleCommentDrawer = async (item) => {
        if (CommentsDrawerState == true) {
            setimageid(null)
            setCommentsDrawerState(false)
        }
        else {
            setimageid(item.image_id)
            let imageid = item.image_id
            await dispatch(GetComments({ imageid }))
            setCommentsDrawerState(true)
        }
    }

    const HandleOptionsDrawer = async (item) => {
        if (OptionsDrawerstate == true) {
            setimageid(null)
            setOptionsDrawerstate(false)
        }
        else {
            setIsPostHidden(item.hidden)
            setimageid(item.image_id)
            await setimageurl(item.image_url)
            setOptionsDrawerstate(true)
        }
    }

    const HandleLike = async (item, index) => {
        try {
            const LikeStatus = await UserProfileInstance.post("/Checklikes", {
                imageid: item.image_id,
                userid: userid,
            });

            if (LikeStatus.data.success === true) {
                setPosts((prevPosts) =>
                    prevPosts.map((post, idx) =>
                        idx === index
                            ? {
                                ...post,
                                is_liked_by_user: !post.is_liked_by_user,
                                like_count: post.is_liked_by_user
                                    ? parseInt(post.like_count) - 1
                                    : parseInt(post.like_count) + 1,
                            }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error("Error while liking:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-8 p-4">
                {posts.map((item, index) => (
                    <div
                        key={item.image_id}
                        className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden"
                    >
                        {
                            item.hidden == false && (
                                <>
                                <div className="flex justify-between">
                            <div className="flex items-center gap-3 p-4">
                                <Image
                                    src={item.profilepic || "/default_profile.png"}
                                    width={40}
                                    height={40}
                                    alt="Profile"
                                    className="rounded-full object-cover w-10 h-10"
                                />
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-800">
                                        {item.name || "Unknown User"}
                                    </h2>
                                    <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex justify-end p-6">
                                <BsThreeDotsVertical onClick={() => HandleOptionsDrawer(item)} />
                            </div>
                        </div>

                        {/* Post Image */}
                        <div className="relative w-full h-80 sm:h-96 md:h-[500px]">
                            <Image
                                src={item.image_url}
                                fill
                                alt="User post"
                                className="object-cover"
                            />
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-6 p-4 text-gray-700 text-xl">
                            <FaHeart
                                className={`cursor-pointer hover:text-red-500 transition-colors duration-200 ${item.is_liked_by_user ? "text-red-400" : "text-gray-700"
                                    }`}
                                onClick={() => HandleLike(item, index)}
                            />
                            <FaRegComment className="cursor-pointer hover:text-blue-400 transition-colors duration-200" onClick={() => HandleCommentDrawer(item)} />
                            <FaShare className="cursor-pointer hover:text-green-400 transition-colors duration-200" />
                        </div>

                        <div className="pl-4 capitalize text-gray-700 text-sm">
                            <h1>{item.description}</h1>
                        </div>

                        {/* Like and Comment Count */}
                        <div className="px-4 pb-4 flex flex-col gap-1 text-sm text-gray-700">
                            <p className="font-semibold">{item.like_count} likes</p>
                            <p className="text-gray-600">{item.comment_count} comments</p>
                        </div>
                                </>
                            )
                        }
                        {/* User Info */}
                        
                    </div>
                ))}
            </div>

            <CommentsDrawer open={CommentsDrawerState} onClose={HandleCommentDrawer} dispatch={dispatch} imageid={imageid} userid={userid} />
        </>
    );
};

export default SingleUserPostsComponent;
