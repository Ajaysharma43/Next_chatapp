"use client";
import { UserPlus } from "lucide-react";

const ReceivedRequests = ({ requests, userId }) => {
    return (
        <section>
            <div className="flex items-center justify-center gap-3 mb-8">
                <UserPlus className="text-purple-600" size={26} />
                <h2 className="text-2xl font-bold text-purple-700">Received Requests</h2>
            </div>

            {requests && requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.map(
                        (request) =>
                            request.receiver_id === userId && (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-purple-100 transition duration-300"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Request #{request.id}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        <strong>From:</strong> {request.sender_id}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <strong>Received:</strong> {new Date(request.created_at).toLocaleString()}
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow transition">
                                            Accept
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">No received requests found.</p>
            )}
        </section>
    );
};

export default ReceivedRequests;
