"use client"
import { useParams } from "next/navigation";
import { useEffect } from "react";

const PersonalChat = () => {
    const { id } = useParams();

    useEffect(() => {
        console.log(id)
    }, [])
    return (
        <>

        </>
    )
}

export default PersonalChat