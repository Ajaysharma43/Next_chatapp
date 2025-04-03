"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [navdata, setnavdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const Pathname = usePathname();
    const accessToken = Cookies.get("AccessToken");
    const [socialauth , setsocialauth] = useState(false)

    const Routes = ["/login", "/signup", "/dashboard", "/not-found"];

    useEffect(() => {
        const GetData = async () => {
            const token = Cookies.get("AccessToken");

            if (!token) {
                console.error("No token found!");
                setLoading(false);
                return;
            }

            try {
                const decode = jwtDecode(token);
                setsocialauth(decode?.socialauthenticated)
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/Nav/NavBar?role=${decode.role}`
                );
                setnavdata(response.data.message);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading when API call finishes
            }
        };

        GetData();
    }, [accessToken]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Hide Navbar on specific routes */}
            <nav
                className={`bg-blue-600 text-white shadow-lg ${
                    Routes.some((route) => Pathname.startsWith(route)) ? "hidden" : "block"
                }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="text-2xl font-bold">
                        <h1>ChatApp</h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        {loading ? (
                            // Loader Skeleton while fetching
                            <>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-24 bg-gray-400 animate-pulse rounded"></div>
                            </>
                        ) : (
                            // Render navigation items
                            navdata.map((item, index) => (
                                <Link key={index} href={item.route} className="hover:text-gray-300">
                                    {item.modules}
                                </Link>
                            ))
                        )}
                        {
                            socialauth == true? (<><button>logout</button></>) : (<></>)
                        }
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-white focus:outline-none" onClick={toggleMobileMenu}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
                    <ul className="bg-blue-600 space-y-2 p-4">
                        {loading ? (
                            // Loader for mobile menu
                            <>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                                <div className="h-6 w-32 bg-gray-400 animate-pulse rounded"></div>
                            </>
                        ) : (
                            navdata.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.route} className="block hover:text-gray-300">
                                        {item.modules}
                                    </Link>
                                </li>
                            ))
                        )}
                        {
                            socialauth == true? (<><button>logout</button></>) : (<></>)
                        }
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
