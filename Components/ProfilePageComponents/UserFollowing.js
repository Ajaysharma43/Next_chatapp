"use client";

import Image from "next/image";
import Link from "next/link";

const UserFollowing = ({ userid, UserFollowing }) => {
    return (
        <div className="p-4">

            {UserFollowing?.length === 0 ? (
                <p>No Following found.</p>
            ) : (
                <ul className="space-y-4">
                    {UserFollowing.map((Following) => (
                        <div key={Following.id}>
                            <Link href={`/singleuser/${Following.receiver_id}`}>
                                <li className="flex items-center gap-4 pb-3">
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {Following.profilepic ? (
                                            <Image
                                                src={Following.profilepic}
                                                alt={Following.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="flex items-center justify-center w-full h-full text-lg font-medium text-white bg-gray-500">
                                                {Following.name?.[0]?.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{Following.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Following on {new Date(Following.created_at).toLocaleDateString()}
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

export default UserFollowing;
