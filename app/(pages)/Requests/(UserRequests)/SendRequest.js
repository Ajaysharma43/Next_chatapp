"use client";
import Image from "next/image";
import { SendHorizonal } from "lucide-react";

const SentRequests = ({ requests, userId }) => {
    const sentRequests = requests?.filter((req) => req.sender_id === userId);

    return (
        <section className="mb-20">

            {sentRequests?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                    {sentRequests.map((request) => (
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
                                        Sent: {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-blue-500 font-medium text-sm">Requested</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No sent requests found.</p>
            )}
        </section>
    );
};

export default SentRequests;
