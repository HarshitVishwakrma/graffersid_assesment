import { Star, Search } from "lucide-react";
import { Outlet } from "react-router-dom";
export default function Header() {
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Review<span className="text-gray-900">&</span>
                <span className="font-extrabold">RATE</span>
              </h1>
            </div>

            <div className="flex-1 max-w-md relative order-last sm:order-none w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
            </div>

            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                SignUp
              </button>
              <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>
      <Outlet></Outlet>
    </>
  );
}
