"use client";
import { SendHorizonal } from "lucide-react";

const SentRequests = ({ requests, userId }) => {
    return (
        <section className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
                <SendHorizonal className="text-blue-600" size={26} />
                <h2 className="text-2xl font-bold text-blue-700">Sent Requests</h2>
            </div>

            {requests && requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.map(
                        (request) =>
                            request.sender_id === userId && (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-blue-100 transition duration-300"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Request #{request.id}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        <strong>To:</strong> {request.receiver_id}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <strong>Sent:</strong> {new Date(request.created_at).toLocaleString()}
                                    </p>
                                    <div className="mt-4 text-yellow-600 font-medium">⏳ Pending</div>
                                </div>
                            )
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">No sent requests found.</p>
            )}
        </section>
    );
};

export default SentRequests;
