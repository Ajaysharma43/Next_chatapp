"use client"
import ProfileData from "@/Components/ProfilePageComponents/ProfileData"
import UserPostsComponent from "@/Components/ProfilePageComponents/UserPosts"
import UserPostsData from "@/Components/ProfilePageComponents/UserPostsDataComponent"
import { GetUserProfileData } from "@/Redux/features/UserProfileSlice"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const UserPosts = () => {
    const [userid, setUserid] = useState(null)
    const [UserProfile, setUserProfile] = useState('')
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const UserPosts = useSelector((state) => state.UserProfileSlice.UserImagesUploadData)

    useEffect(() => {
        const Token = Cookies.get('AccessToken')
        if (Token) {
            try {
                const decode = jwtDecode(Token)
                setUserid(decode.id)
                setUserProfile(decode.profile)
                dispatch(GetUserProfileData({ userid: decode.id }))
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
        <>
            <UserPostsComponent userid={userid} Userposts={UserPosts} UserProfile={UserProfile} />
        </>
    )
}

export default UserPosts