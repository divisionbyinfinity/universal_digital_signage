import { useLocation } from "react-router-dom";
export default function NotFound({status=404,message='Requested Page Not Found',link='/', page=false,color='black'}) {
    const location = useLocation();

    return (
      <>
        <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-red-600" >{status}</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl" style={{color:color}}>{message}</h1>
            <p className="mt-6 text-base leading-7 text-gray-600">{page?location.pathname.slice(1,):''} Page not found</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/login"
                className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                home
              </a>
              {/* <a href={link} className="text-sm font-semibold text-gray-900">
                Add Customer <span aria-hidden="true">&rarr;</span>
              </a> */}
            </div>
          </div>
        </main>
      </>
    )
  }
  