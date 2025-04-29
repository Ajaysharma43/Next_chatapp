"use client"
import FriendsPosts from "@/Components/HomapageComponts/FriendsPosts";
import { GetFriendsPosts } from "@/Redux/features/UserProfileSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserPostsPage = () => {
  const [userid , setuserid] = useState(null)
  const [username , setusername] = useState(null)
  const [loading , setLoading] = useState(true)
  const FriendsData = useSelector((state) => state.UserProfileSlice.FriendsPosts)
  const dispatch = useDispatch()

  useEffect(() => {
    const Token = Cookies.get('AccessToken')
    try {
      const decode = jwtDecode(Token)
      setuserid(decode.id);
      setusername(decode.username)
      dispatch(GetFriendsPosts({userid : decode.id}))
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  },[])

  if(!userid && loading)
  {
    return null
  }
  return(
    <>
    <FriendsPosts userid={userid} username={username} posts={FriendsData}/>
    </>
  )
}

export default UserPostsPage;