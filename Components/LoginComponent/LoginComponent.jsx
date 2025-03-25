"use client";
import { useState } from "react";
import { AuthInstance } from "@/Interseptors/AuthInterseptors";
import Cookies from "js-cookie";
import Link from "next/link";
const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.email && formData.password)
        {
            const res = await AuthInstance.post('/Login' , {formData})
            console.log("res is : " , res.data)
            if(res.data.success == true)
            {
                Cookies.set('RefreshToken' , res.data.RefreshToken , {expires : 7})
                sessionStorage.setItem('AccessToken' , res.data.AccessToken)
                alert("login successfully")
            }
            else
            {
                alert('check crendentials and try again')
            }
        }
    };

    return (
        <div className="relative max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-10">
                    <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

            {errorMessage && <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border rounded-md mb-3"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 border rounded-md mb-3"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-md mt-3 hover:bg-blue-600 transition disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    Login
                </button>
            </form>

            <p className="text-sm text-center mt-3">Do not have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
        </div>
    );
};

export default LoginForm;
