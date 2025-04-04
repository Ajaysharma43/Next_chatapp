"use client"
import SearchUsers from "@/Components/FindUsersComponent/SearchUsers.jsx"
import ShowUserData from "@/Components/FindUsersComponent/ShowUserdata"

const About = () => {
    return(
        <>
        
        <article>
            <section>
                <SearchUsers/>
            </section>
            <section>
                <ShowUserData/>
            </section>
        </article>
        </>
    )
}

export default About