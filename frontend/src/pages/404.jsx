import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src="/404.png" alt="" className="select-none border-2 border-gray-200 w-144 aspect-video object-cover rounded" />
            <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
            <p className="text-gray-600 text-xl leading-7 -mt-8">The page you are looking for does not exists. Head back to the <Link to="/" className="text-black underline">home page</Link>.</p>

            <div className="mt-auto">
                <img src="/full-logo.svg" alt="" className="h-8 object-contain block mx-auto select-none" />
                <p className="mt-5 text-gray-600">Read millions of projects script around the world.</p>
            </div>
        </section>
    )
}

export default PageNotFound;
