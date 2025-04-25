"use client"

import ProfileData from "@/Components/ProfilePageComponents/ProfileData"
import UserPostsData from "@/Components/ProfilePageComponents/UserPostsDataComponent"
import { GetUserProfileData } from "@/Redux/features/UserProfileSlice"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const ProfilePage = () => {
    const [userid, setUserid] = useState(null)
    const [loading, setLoading] = useState(true)
    const UserPosts = useSelector((state) => state.UserProfileSlice.UserImagesUploadData)
    const UserData = useSelector((state) => state.UserProfileSlice.UserDetails)
    const dispatch = useDispatch()

    useEffect(() => {
        const Token = Cookies.get('AccessToken')
        if (Token) {
            try {
                const decode = jwtDecode(Token)
                setUserid(decode.id)
                dispatch(GetUserProfileData({ userid : decode.id }))
            } catch (error) {
                console.error("Invalid token:", error)
            }
        }
        setLoading(false)
    }, [])

    if (loading || !userid) {
        return null // Or replace with a loader/spinner if you want
    }

    return (
        <div className="p-4">
            <ProfileData userid={userid} UserData={UserData}/>
            <UserPostsData userid={userid} UserPosts={UserPosts}/>
        </div>
    )
}

export default ProfilePage
