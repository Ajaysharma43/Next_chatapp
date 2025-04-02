import { useSelector } from "react-redux"

const BackdropLoader = () => {
    const SearchLoading = useSelector((state) => state.DashboardReducer.SearchLoading)
    return (
        <>
        {
            SearchLoading == true? (
<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#11111142] bg-opacity-50 z-50">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg mt-4">loading</p>
            </div>
            )
            :
            ""
        } 
        </>
    )
}

export default BackdropLoader