"use client"
import UserPostsComponent from "@/Components/ProfilePageComponents/UserPosts"
import SingleUserPostsComponent from "@/Components/SingleUserComponents/Posts"
import { GetUserPostsData } from "@/Redux/features/UserSlice"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const UserPosts = () => {
    const { id } = useParams()
    const [userid, setUserid] = useState(null)
    const [UserProfile, setUserProfile] = useState('')
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const ImagesData = useSelector((state) => state.UserReducer.ImagesData);

    useEffect(() => {
        const Token = Cookies.get('AccessToken')
        if (Token) {
            try {
                const decode = jwtDecode(Token)
                setUserid(decode.id)
                setUserProfile(decode.profile)
                dispatch(GetUserPostsData({ userid: id }))
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
            <SingleUserPostsComponent userid={userid} Userposts={ImagesData} UserProfile={UserProfile} />
        </>
    )
}

export default UserPosts