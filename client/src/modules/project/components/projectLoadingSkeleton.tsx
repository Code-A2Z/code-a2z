const ProjectLoadingSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="mx-auto max-w-[900px] py-10 max-lg:px-[5vw] animate-pulse">
      <div className="my-8 flex max-sm:flex-col justify-between sm:items-center">
        <div className="bg-gray-300 dark:bg-gray-700 h-10 w-[60%] rounded-md"></div>
        <div className="flex items-center gap-4 mt-4 sm:mt-2">
          <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>

      <div className="bg-gray-300 dark:bg-gray-700 aspect-video w-full rounded-md"></div>

      <div className="flex max-sm:flex-col justify-between my-12">
        <div className="flex gap-5 items-start">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded-md max-sm:mt-6 max-sm:ml-12 max-sm:pl-5"></div>
      </div>

      {/* <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-full my-6"></div> */}

      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex justify-between space-x-4 border-y-2 border-x-0 py-2 my-2 border-y-gray-300 dark:border-y-gray-700">
            <div className="flex items-center space-x-4">
              <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
              <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="size-10 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="h-10 my-10 bg-gray-300 dark:bg-gray-700 rounded w-[80%]"></div>
        </div>
      ))}
    </div>
  );
};

export default ProjectLoadingSkeleton;
