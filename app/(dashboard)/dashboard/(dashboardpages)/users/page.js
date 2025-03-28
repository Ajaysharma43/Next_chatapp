"use client";
import { GetUserData } from "@/Redux/features/DashboardSlice";
import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateDialog } from "./(UserDialogs)/UpdateDialoag";

const Users = () => {
  const UserData = useSelector((state) => state.DashboardReducer.UserData);
  const [UpdateDialogState, setUpdateDialogState] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    roles: "",
  });
  const [limit, setLimit] = useState(5);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserData({ limit }));
    console.log(UserData);
  }, [dispatch, limit]);

  const handleEdit = (user) => {
    setFormData(user); // Set the selected user's data in the form
    setUpdateDialogState(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setUpdateDialogState(false); // Close the dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      postal_code: "",
      country: "",
      roles: "",
    }); // Clear the form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    // Add logic to update the user data (e.g., dispatch an action or call an API)
    handleCloseDialog(); // Close the dialog after submission
  };

  return (
    <>
      {/* Update Dialog */}
      <UpdateDialog
        open={UpdateDialogState}
        onClose={handleCloseDialog}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Users Page</h1>

        {/* Responsive Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            {/* Table Head */}
            <thead>
            <tr className="bg-gray-200 text-gray-700 text-xs md:text-sm">
                <th className="border border-gray-300 px-2 md:px-4 py-2">ID</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Name</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Email</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2 ">Phone</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2 ">Street</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">City</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2 ">Postal Code</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2 ">Country</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Role</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Password</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Operations</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
            {UserData.map((item) => {
                const createdAt = new Date(item.created_at);
                const formattedDate = createdAt.toLocaleDateString();
                const formattedTime = createdAt.toLocaleTimeString();

                return (
                  <tr key={item.id} className="hover:bg-gray-100 text-xs md:text-sm">
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.email}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 ">{item.phone}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 ">{item.street}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.city}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 ">{item.postal_code}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 ">{item.country}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.roles}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {formattedDate} <span className="hidden md:inline">{formattedTime}</span>
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.password}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-semibold py-1 px-2 md:py-2 md:px-3 rounded-lg transition duration-300"
                          onClick={() => handleEdit(item)} // Handle edit button click
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-semibold py-1 px-2 md:py-2 md:px-3 rounded-lg transition duration-300">
                          <Trash size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;