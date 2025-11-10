import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src="/404.png"
        alt=""
        className="select-none border-2 border-gray-200 dark:border-gray-700 w-144 aspect-video object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7 text-black dark:text-white">
        Page not found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-xl leading-7 -mt-8">
        The page you are looking for does not exist. Head back to the{' '}
        <Link to="/" className="text-black dark:text-white underline">
          home page
        </Link>
        .
      </p>

      <div className="mt-auto text-center">
        <img
          src="/full-logo.png"
          alt=""
          className="select-none border-2 border-gray-200 dark:border-gray-700 h-16 rounded-md mx-auto"
        />
        <p className="mt-5 text-gray-600 dark:text-gray-400">
          Read millions of project scripts around the world.
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;