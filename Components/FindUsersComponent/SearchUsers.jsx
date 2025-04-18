"use client"
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetSearchUsers, setUsersList } from "@/Redux/features/UserSlice"; // <-- Import your reset/clear action
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const SearchUsers = () => {
    const [query, setQuery] = useState(""); // User input
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced value
    const dispatch = useDispatch();

    // Debounce logic (500ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler); // Cleanup on re-render
    }, [query]);

    // API Call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const Token = Cookies.get("AccessToken");
                const Decode = jwtDecode(Token);

                if (debouncedQuery.trim() === "") {
                    dispatch(setUsersList([])); // Reset user list if input is empty
                    return;
                }

                dispatch(GetSearchUsers({ query, id: Decode.id }));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [debouncedQuery]);

    return (
        <div className="p-4">
            <input
                type="search"
                placeholder="Enter the username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 border rounded w-full"
            />
        </div>
    );
};

export default SearchUsers;
