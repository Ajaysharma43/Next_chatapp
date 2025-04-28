"use client";

import Image from "next/image";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa"; // Using react-icons

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
};

const UserPostsComponent = ({ userid, Userposts, UserProfile }) => {

    return (
        <div className="flex flex-col items-center gap-8 p-4">
            {Userposts.map((item) => (
                <div
                    key={item.image_id}
                    className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden"
                >
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4">
                        <Image
                            src={UserProfile || "/default_profile.png"}
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
                        <FaHeart className={`cursor-pointer hover:text-red-500 transition-colors duration-200 ${item.is_liked_by_user == true ? "text-red-400" : "text-gray-700"}`} />
                        <FaRegComment className="cursor-pointer hover:text-blue-400 transition-colors duration-200" />
                        <FaShare className="cursor-pointer hover:text-green-400 transition-colors duration-200" />
                    </div>

                    {/* Like and Comment Count */}
                    <div className="px-4 pb-4 flex flex-col gap-1 text-sm text-gray-700">
                        <p className="font-semibold">{item.like_count} likes</p>
                        <p className="text-gray-600">{item.comment_count} comments</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserPostsComponent;
