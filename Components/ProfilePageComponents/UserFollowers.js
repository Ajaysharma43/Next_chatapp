"use client";

import Image from "next/image";
import Link from "next/link";

const UserFollowers = ({ userid, UserFollowers }) => {
    return (
        <div className="p-4">

            {UserFollowers?.length === 0 ? (
                <p>No followers found.</p>
            ) : (
                <ul className="space-y-4">
                    {UserFollowers.map((follower) => (
                        <div key={follower.id}>
                            <Link href={`/singleuser/${follower.sender_id}`}>
                        <li className="flex items-center gap-4 pb-3">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {follower.profilepic ? (
                                    <Image
                                        src={follower.profilepic}
                                        alt={follower.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="flex items-center justify-center w-full h-full text-lg font-medium text-white bg-gray-500">
                                        {follower.name?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium">{follower.name}</p>
                                <p className="text-sm text-gray-500">
                                    Followed on {new Date(follower.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                        </Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserFollowers;
