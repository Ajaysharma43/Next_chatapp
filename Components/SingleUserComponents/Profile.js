"use client"

import Image from "next/image"
import Link from "next/link"
import { useDispatch } from "react-redux"

const SingleProfileData = ({ userid, UserData, buttons }) => {
    const dispatch = useDispatch()
    const user = UserData[0]

    if (!user) return null

    return (
        <div className="w-full bg-white p-6 md:flex md:gap-10 transition-all duration-300">
            <div className="flex flex-col items-center md:items-start md:w-1/3 relative">
                <div className="relative w-36 h-36 rounded-full overflow-visible border-4 border-indigo-200">
                    {user.profilepic ? (
                        <Image
                            src={user.profilepic}
                            alt="Profile"
                            fill
                            className="object-cover rounded-full"
                        />
                    ) : (
                        <h1 className="text-7xl font-bold flex items-center justify-center w-full h-full bg-indigo-100 rounded-full uppercase text-black">
                            {user?.name?.charAt(0)}
                        </h1>
                    )}
                </div>
                <h1 className="text-2xl font-bold mt-4 text-gray-800 text-center md:text-left">
                    {user.name}
                </h1>
                <p className="text-sm text-gray-500 text-center md:text-left">
                    Digital Creator ✨
                </p>

                {/* Buttons injected from parent */}
                {buttons && (
                    <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                        {buttons}
                    </div>
                )}
            </div>

            <div className="mt-6 md:mt-0 md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-xl font-semibold text-indigo-600">{user.post_count}</p>
                        <p className="text-sm text-gray-500">Posts</p>
                    </div>

                    <Link href={`/singleuser/${user.user_id}/friends`}>
                        <div>
                            <p className="text-xl font-semibold text-indigo-600">{user.followers_count}</p>
                            <p className="text-sm text-gray-500">Followers</p>
                        </div>
                    </Link>
                    <Link href={`/singleuser/${user.user_id}/friends`}>
                        <div>
                            <p className="text-xl font-semibold text-indigo-600">{user.following_count}</p>
                            <p className="text-sm text-gray-500">Following</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SingleProfileData
