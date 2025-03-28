import { notFound } from "next/navigation"
import { NextResponse } from "next/server"

export const DashboardAccess = (role , request) => {
    if(role == 'admin')
    {
        console.log("you are authorized")
        return NextResponse.next()
    }
    else
    {
        console.log('you are Unauthorized')
        return NextResponse.rewrite(new URL("/not-found", request.url));
    }
}