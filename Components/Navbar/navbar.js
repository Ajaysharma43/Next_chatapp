"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import LoadingBar from "react-top-loading-bar";

const Navbar = () => {
    const [navdata, setnavdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const accessToken = Cookies.get("AccessToken");
    const [socialauth, setsocialauth] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const loadingBar = useRef(null); // for top loading bar
    const [progress , setprogress] = useState(0)

    const Routes = ["/login", "/signup", "/dashboard", "/not-found"];

    useEffect(() => {
        const GetData = async () => {
            const token = Cookies.get("AccessToken");

            try {
                const decode = jwtDecode(token);
                setprogress(30)
                setsocialauth(decode?.socialauthenticated);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/Nav/NavBar?role=${decode.role}`
                );
                setprogress(60)
                setnavdata(response.data.message);
                setprogress(100)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        GetData();
    }, [accessToken]);

    // Start/stop loading bar on route change
    useEffect(() => {
        const start = () => loadingBar.current?.continuousStart();
        const stop = () => loadingBar.current?.complete();

        router.events?.on("routeChangeStart", start);
        router.events?.on("routeChangeComplete", stop);
        router.events?.on("routeChangeError", stop);

        return () => {
            router.events?.off("routeChangeStart", start);
            router.events?.off("routeChangeComplete", stop);
            router.events?.off("routeChangeError", stop);
        };
    }, [router]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const Logout = () => {
        Cookies.remove("AccessToken");
        Cookies.remove("RefreshToken");
        router.push("/login");
    };

    return (
        <>
            {/* Loading Bar */}
            <LoadingBar color="green" ref={loadingBar} height={3} progress={progress}/>

            <nav
                className={`bg-blue-600 text-white shadow-lg ${Routes.some((route) =>
                    pathname.startsWith(route)
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
                                <Link key={index} href={item.route} className="hover:text-gray-300">
                                    {item.modules}
                                </Link>
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

                {/* Mobile Menu */}
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
                                    <Link href={item.route} className="block hover:text-gray-300">
                                        {item.modules}
                                    </Link>
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

