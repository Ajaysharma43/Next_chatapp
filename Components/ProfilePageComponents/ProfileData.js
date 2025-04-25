"use client"

import { useState } from "react"
import { Dialog } from "@mui/material"
import Image from "next/image"
import { UpdateProfile } from "./Dialogs/UpdateProfilepic"
import { useDispatch } from "react-redux"
import { UpdateProfilePic } from "@/Redux/features/UserProfileSlice"
import { FaEdit } from "react-icons/fa" 
import Link from "next/link"

const ProfileData = ({ userid, UserData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const dispatch = useDispatch()
    const user = UserData[0]

    if (!user) return null

    const openDialog = () => setDialogOpen(true)  
    const closeDialog = () => setDialogOpen(false) 

    const HandleUpdateImage = (formdata) => {
        dispatch(UpdateProfilePic({ formdata }))
        setSelectedImage(null)
    }

    return (
        <div className="w-full bg-white rounded-3xl p-6 md:flex md:items-center md:gap-10 transition-all duration-300">
            <div className="flex flex-col items-center md:items-start md:w-1/3 relative">
                <div className="relative w-36 h-36 rounded-full overflow-visible border-4 border-indigo-200">
                    <Image
                        src={user.profilepic}
                        alt="Profile"
                        fill
                        className="object-cover rounded-full"
                    />
                    {/* Update Icon */}
                    <div
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-indigo-100 transform translate-x-1 translate-y-1 z-10"
                        onClick={openDialog} // Open dialog on icon click
                    >
                        <FaEdit className="text-indigo-600" size={22} /> {/* React Icon */}
                    </div>
                </div>
                <h1 className="text-2xl font-bold mt-4 text-gray-800 text-center md:text-left">
                    {user.name}
                </h1>
                <p className="text-sm text-gray-500 text-center md:text-left">Digital Creator ✨</p>
            </div>

            <div className="mt-6 md:mt-0 md:w-2/3 flex flex-col justify-between">
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-xl font-semibold text-indigo-600">{user.post_count}</p>
                        <p className="text-sm text-gray-500">Posts</p>
                    </div>
                    <div>
                        <Link href={'/profile/friends'}>
                            <p className="text-xl font-semibold text-indigo-600">{user.followers_count}</p>
                            <p className="text-sm text-gray-500">Followers</p>
                        </Link>
                    </div>
                    <div>
                        <Link href={'/profile/friends'}>
                            <p className="text-xl font-semibold text-indigo-600">{user.following_count}</p>
                            <p className="text-sm text-gray-500">Following</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Profile Picture Update Dialog */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <UpdateProfile onClose={closeDialog} userid={userid} selectedImage={selectedImage} setSelectedImage={setSelectedImage} onSave={HandleUpdateImage} />
            </Dialog>
        </div>
    )
}

export default ProfileData
