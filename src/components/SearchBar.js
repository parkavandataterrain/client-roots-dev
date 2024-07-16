const SearchBar = () => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <img src="./search.png" class="h-6 w-6" />

            </div>
            {/* <input type="search" id="default-search" className="shadow h-[4.63vh] w-[15.021vw] px-12 text-md placeholder-gray-500 placeholder-opacity-50" placeholder="Search here" ></input> */}
            <input
                class="border-b border-green-800/50  focus:outline-none px-14 py-1 w-full placeholder-green-800/50"
                type="text"
                placeholder="Search Here"
                id="username"
            />
        </div>
    );
}

export default SearchBar;
