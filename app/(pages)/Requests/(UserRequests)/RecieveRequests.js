"use client";
import Image from "next/image";
import { AcceptRequest } from "@/Redux/features/UserSlice";
import { UserPlus } from "lucide-react";
import { useDispatch } from "react-redux";

const ReceivedRequests = ({ requests, userId }) => {
    const dispatch = useDispatch();
    const receivedRequests = requests?.filter((req) => req.receiver_id === userId);

    return (
        <section>

            {receivedRequests?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                    {receivedRequests.map((request) => (
                        <div
                            key={request.id}
                            className="flex items-center justify-between bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={request.profilepic}
                                    alt={request.name}
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover w-12 h-12"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{request.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Received: {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        dispatch(
                                            AcceptRequest({
                                                data: {
                                                    sender: request.sender_id,
                                                    receiver: request.receiver_id,
                                                },
                                            })
                                        )
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-xl"
                                >
                                    Accept
                                </button>
                                <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-xl">
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No received requests found.</p>
            )}
        </section>
    );
};

export default ReceivedRequests;
