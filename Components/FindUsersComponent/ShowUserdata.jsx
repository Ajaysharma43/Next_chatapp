import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ShowUserData = () => {
    const SearchData = useSelector((state) => state.UserReducer.SearchData);
    const SearchLoading = useSelector((state) => state.UserReducer.IsSearchLoading);

    useEffect(() => {
        console.log(SearchData);
    }, [SearchData]); 

    if (SearchLoading) {
        return <h1 className="text-center text-lg font-semibold text-blue-600">Searching data...</h1>;
    }

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
            {SearchData.length > 0 ? (
                <div className="space-y-3">
                    {SearchData.map((item) => (
                        <>
                        <Link href={`/singleuser/${item.id}`}>
                        <div key={item.id} className="bg-white p-3 rounded-lg shadow hover:bg-gray-50 transition">
                            <h1 className="text-lg font-semibold text-gray-800">{item.name}</h1>
                            
                        </div>
                        </Link>
                        </>
                    ))}
                </div>
            ) : (
                <h2 className="text-center text-gray-500">No users found</h2>
            )}
        </div>
    );
};

export default ShowUserData;
