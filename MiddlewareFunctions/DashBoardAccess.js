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
        return NextResponse.redirect(new URL("/login", request.url));
    }
}