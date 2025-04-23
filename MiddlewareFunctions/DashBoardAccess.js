import { NextResponse } from "next/server"

export const DashboardAccess = (role , request) => {
    const next = NextResponse.next()
    if(role == 'admin')
    {
        return NextResponse.next()
    }
    else
    {
        return NextResponse.rewrite(new URL("/not-found", request.url));
    }
}