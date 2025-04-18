"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Navbar = () => {
    const [navdata, setnavdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const Pathname = usePathname();
    const accessToken = Cookies.get("AccessToken");
    const [socialauth, setsocialauth] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const Routes = ["/login", "/signup", "/dashboard", "/not-found"];

    useEffect(() => {
        setLogoutLoading(false);
        setIsNavigating(false)
        setMobileMenuOpen(false);
        const GetData = async () => {
            try {
                const token = Cookies.get("AccessToken");
                const decode = jwtDecode(token);
                setsocialauth(decode?.socialauthenticated);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/Nav/NavBar?role=${decode.role}`
                );
                setnavdata(response.data.message);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        GetData();
    }, [accessToken]);

    // Navigation loader
    useEffect(() => {
        const handleStart = () => setIsNavigating(true);
        const handleEnd = () => setIsNavigating(false);

        window.addEventListener("next:router-start", handleStart);
        window.addEventListener("next:router-complete", handleEnd);
        window.addEventListener("next:router-error", handleEnd);

        return () => {
            window.removeEventListener("next:router-start", handleStart);
            window.removeEventListener("next:router-complete", handleEnd);
            window.removeEventListener("next:router-error", handleEnd);
        };
    }, []);

    useEffect(() => {
        setIsNavigating(false);
    }, [isNavigating])

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const Logout = () => {
        setLogoutLoading(true);
        setTimeout(() => {
            Cookies.remove("AccessToken");
            Cookies.remove("RefreshToken");
            router.push("/login");
        }, 1000);
    };

    const handleNavClick = (href) => {
        setIsNavigating(true);
        router.push(href);
        setMobileMenuOpen(false);
    };


    return (
        <>
            {/* Backdrop Loader for Logout or Navigation */}
            {(logoutLoading || isNavigating) && (
                <div className="fixed inset-0 bg-[#1111115a] z-50 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <nav
                className={`bg-blue-600 text-white shadow-lg ${Routes.some((route) =>
                    Pathname.startsWith(route)
                )
                    ? "hidden"
                    : "block"
                    }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        <h1>ChatApp</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-6 items-center">
                        {loading ? (
                            <>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                            </>
                        ) : (
                            navdata.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavClick(item.route)}
                                    className="hover:text-gray-300"
                                >
                                    {item.modules}
                                </button>
                            ))
                        )}

                        <button
                            className="bg-teal-500 text-white rounded-lg p-2 transition-all duration-200 hover:bg-teal-700"
                            onClick={Logout}
                        >
                            Logout
                        </button>

                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="bg-white text-black dark:bg-black dark:text-white px-3 py-1 rounded hover:opacity-80 transition"
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button className="text-white focus:outline-none" onClick={toggleMobileMenu}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
                    <ul className="bg-blue-600 space-y-2 p-4">
                        {loading ? (
                            <>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                            </>
                        ) : (
                            navdata.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleNavClick(item.route)}
                                        className="block w-full text-left hover:text-gray-300"
                                    >
                                        {item.modules}
                                    </button>
                                </li>
                            ))
                        )}

                        <button
                            className="bg-teal-500 text-white rounded-lg p-2 transition-all duration-200 hover:bg-teal-700"
                            onClick={Logout}
                        >
                            Logout
                        </button>

                        <li>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="w-full bg-white text-black dark:bg-black dark:text-white px-3 py-1 rounded hover:opacity-80 transition"
                            >
                                {theme === "dark" ? "Light" : "Dark"}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
