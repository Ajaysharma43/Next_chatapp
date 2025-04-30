"use client"

import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

const UserPostsData = ({ userid, UserPosts }) => {
    return (
        <div className="w-full mt-6 grid grid-cols-3 gap-1 sm:gap-2">
            {UserPosts?.length === 0 ? (
                <div className="text-center col-span-full text-gray-500 mt-4">No posts yet.</div>
            ) : (
                UserPosts.map((post) => (
                    <div key={post.id}>
                        {
                            post.hidden == false && (
                                <>
                                    <div
                                        key={post.image_id}
                                        className="relative group aspect-square bg-gray-200 overflow-hidden"
                                    >
                                        <Link href={'/profile/posts'}>
                                            <Image
                                                src={post.image_url}
                                                alt={post.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-[#11111154] bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                                <div className="text-white text-sm flex gap-6 items-center">
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" /> {post.like_count}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="w-4 h-4" /> {post.comment_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            )
                        }
                    </div>

                ))
            )}
        </div>
    )
}

export default UserPostsData
