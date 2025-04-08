"use client";
import { GetRequests } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SentRequests from "./(UserRequests)/SendRequest";
import ReceivedRequests from "./(UserRequests)/RecieveRequests";

const Contact = () => {
    const Requests = useSelector((state) => state.UserReducer.Requests);
    const RecieveRequests = useSelector((state) => state.UserReducer.RecieveRequests);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const GetUserRequests = () => {
            const Token = Cookies.get("AccessToken");
            const Decode = jwtDecode(Token);
            setUserId(Decode.id);
            dispatch(GetRequests({ senderid: Decode.id }));
        };
        GetUserRequests();
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-6">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-16 drop-shadow-lg">
                🤝 Friend Requests
            </h1>
            <SentRequests requests={Requests} userId={userId} />
            <ReceivedRequests requests={RecieveRequests} userId={userId} />
        </div>
    );
};

export default Contact;
