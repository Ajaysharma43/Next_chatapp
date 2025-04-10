"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const ShowUserData = () => {
  const SearchData = useSelector((state) => state.UserReducer.SearchData);
  const SearchLoading = useSelector((state) => state.UserReducer.IsSearchLoading);

  useEffect(() => {
    console.log(SearchData);
  }, [SearchData]);

  if (SearchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <h1 className="text-lg font-semibold text-blue-600 animate-pulse">
          Searching data...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {SearchData.length > 0 ? (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence>
            {SearchData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/singleuser/${item.id}`}>
                  <div className="group bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm shadow-sm">
                        {item.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                          {item.name}
                        </h2>
                        {/* Optional subtitle or role */}
                        {/* <p className="text-sm text-gray-500">Student</p> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <h2 className="text-center text-gray-500 mt-6">No users found</h2>
      )}
    </div>
  );
};

export default ShowUserData;
