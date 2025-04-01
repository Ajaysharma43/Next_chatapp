"use client";
import { GetUserData, SortUserData } from "@/Redux/features/DashboardSlice";
import { ArrowBigLeft, ArrowBigRight, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateDialog } from "./(UserDialogs)/UpdateDialoag";
import { DashboardInstance } from "@/Interseptors/DashboardInterseptors";
import { DeleteUser } from "./(UserDialogs)/DeleteDilog";
import { AddUser } from "./(UserDialogs)/AddUser";
import { Sorting } from "./(UserDialogs)/SortingDialog";

const Users = () => {
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.DashboardReducer.UserData);
  const Totalpages = useSelector((state) => state.DashboardReducer.Totalpages);
  const [localUserData, setLocalUserData] = useState(UserData);
  const [UpdateDialogState, setUpdateDialogState] = useState(false);
  const [DeleteDilog, setdeletedilog] = useState(false)
  const [AddUserDialog, setAddUserDialog] = useState(false)
  const [sortdialog, setsortdialog] = useState(false)
  const [id, setid] = useState(null)
  const [sortingData, setSortingData] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    roles: "",
  });
  const [limit, setLimit] = useState(2);
  const [page, setpage] = useState(1)
  const [IsSorting, setIsSorting] = useState(false)

  useEffect(() => {
    if (IsSorting == true) {
      let data = sortingData
      dispatch(SortUserData({ data, limit, page }))
    }
    else {
      dispatch(GetUserData({ limit, page }));
    }

  }, [dispatch, limit, page, SortUserData]);

  useEffect(() => {
    setLocalUserData(UserData);
  }, [UserData]);

  const handleEdit = (user) => {
    setFormData(user);
    setUpdateDialogState(true);
  };

  const handleCloseDialog = () => {
    setUpdateDialogState(false);
    setFormData({
      name: "",
      phone: "",
      street: "",
      city: "",
      postal_code: "",
      country: "",
      roles: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await DashboardInstance.post("/Update", { formData });
      if (res.data.Success) {
        setLocalUserData((prevData) =>
          prevData.map((user) =>
            user.id === formData.id ? { ...user, ...formData } : user
          )
        );

        handleCloseDialog();
      } else {
        alert("Data updating failed");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const HandleDeleteDialog = (id) => {
    if (DeleteDilog == false) {
      setid(id)
      setdeletedilog(true)
    }
    else {
      setid(null)
      setdeletedilog(false)
    }
  }

  const HandleDelete = async (id) => {
    console.log("user deleted with id : ", id)
    const res = await DashboardInstance.delete(`/Delete?id=${id}`)
    if (res.data.Success == true) {
      const updatedata = localUserData.filter((item) => item.id !== id)
      let data = sortingData
      dispatch(SortUserData({ data, limit, page }))

      setdeletedilog(false)
    }
    else {
      alert('user delete failed')
    }

  }

  const HandleCreate = () => {
    if (AddUserDialog == false) {
      setAddUserDialog(true)
    }
    else {
      setAddUserDialog(false)
    }
  }

  const CreateUser = async (UserData) => {
    console.log('user data is : ', UserData)
    const res = await DashboardInstance.post('/CreateUser', { UserData })
    if (res.data.Success == true) {
      let data = sortingData
      dispatch(SortUserData({ data, limit, page }))
    }
    else {
      alert('user creation failed')
    }
  }

  const HandleSortingdialog = () => {
    if (sortdialog == false) {
      setsortdialog(true)
    }
    else {
      setsortdialog(false)
    }
  }

  const handleSort = (data) => {
    setIsSorting(true)
    console.log(data)
    setSortingData(data)
    dispatch(SortUserData({ data, limit, page }))
  }

  const Togglepage = (page) => {
    setpage(page)
  }

  const NextPage = () => {
    if (page >= Totalpages) {
      setpage(Totalpages)
    }
    else {
      setpage(page + 1)
    }
  }

  const PrevPage = () => {
    if (page <= 1) {
      setpage(1)
    }
    else {
      setpage(page - 1)
    }
  }

  return (
    <>
      <UpdateDialog
        open={UpdateDialogState}
        onClose={handleCloseDialog}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <DeleteUser open={DeleteDilog} onClose={HandleDeleteDialog} id={id} handleDelete={HandleDelete} />

      <AddUser open={AddUserDialog} onClose={HandleCreate} HandleCreate={CreateUser} />

      <Sorting open={sortdialog} onClose={HandleSortingdialog} handleSort={handleSort} />

      <div className="flex justify-end m-4">
        <button className="uppercase bg-purple-400 p-4 text-white shadow rounded-lg transition-all duration-300 hover:bg-purple-600" onClick={HandleSortingdialog}>sortdata</button>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Users Page</h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-xs md:text-sm">
                <th className="border border-gray-300 px-2 md:px-4 py-2">ID</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Name</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Email</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Street</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">City</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Postal Code</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Country</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Role</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Password</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Operations</th>
              </tr>
            </thead>

            <tbody>
              {localUserData.map((item) => {
                const createdAt = new Date(item.created_at);
                const formattedDate = createdAt.toLocaleDateString();
                const formattedTime = createdAt.toLocaleTimeString();

                return (
                  <tr key={item.id} className="hover:bg-gray-100 text-xs md:text-sm">
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.email}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.phone}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.street}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.city}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.postal_code}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.country}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.roles}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {formattedDate} <span className="hidden md:inline">{formattedTime}</span>
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">{item.password}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-semibold py-1 px-2 md:py-2 md:px-3 rounded-lg transition duration-300"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-semibold py-1 px-2 md:py-2 md:px-3 rounded-lg transition duration-300"
                          onClick={() => HandleDeleteDialog(item.id)}>
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
      <div className="flex justify-center gap-4">
        <button onClick={PrevPage} className={`w-fit h-fit p-1 transition-all duration-200  ${page == 1 ? "text-gray-500" : "text-black hover:bg-gray-300 hover:rounded-full"}`}>
          <ArrowBigLeft className={``} />
        </button>

        {
          Array.from({ length: Totalpages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 border rounded transition-all duration-500 ${page == i + 1 ? "bg-blue-300 hover:bg-blue-400" : "bg-amber-300 hover:bg-amber-400"}`}
              onClick={() => Togglepage(i + 1)}
            >
              {i + 1}
            </button>
          ))
        }
        <button onClick={NextPage} className={`w-fit h-fit p-1 transition-all duration-200  ${page == Totalpages ? "text-gray-500" : "text-black hover:bg-gray-300 hover:rounded-full"}`}><ArrowBigRight /></button>
      </div>

      <div className="flex justify-end m-4">
        <button className="uppercase bg-purple-400 p-4 text-white shadow rounded-lg transition-all duration-300 hover:bg-purple-600" onClick={HandleCreate}>Adduser</button>
      </div>
    </>
  );
};

export default Users;
