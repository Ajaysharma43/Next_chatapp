"use client"
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetSearchUsers } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const SearchUsers = () => {
    const [query, setQuery] = useState(""); // User input
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced value
    const dispatch = useDispatch()

    // Debounce logic (500ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler); // Cleanup on re-render
    }, [query]);

    // API Call
    useEffect(() => {
        if (debouncedQuery.trim() === "") return;

        const fetchUsers = async () => {
            try {
                const Token = Cookies.get('AccessToken')
                const Decode = jwtDecode(Token)
                dispatch(GetSearchUsers({query , id : Decode.id}))
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
