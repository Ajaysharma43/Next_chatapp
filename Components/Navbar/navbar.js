const Navbar = () => {
    return (
        <>
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="text-2xl font-bold">
                        <h1>ChatApp</h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <a href="#home" className="hover:text-gray-300">Home</a>
                        <a href="#about" className="hover:text-gray-300">About</a>
                        <a href="#contact" className="hover:text-gray-300">Contact</a>
                        <a href="#chat" className="hover:text-gray-300">Chat</a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-white focus:outline-none">
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
            </nav>
        </>
    );
};

export default Navbar;