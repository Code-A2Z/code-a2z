const LatestProjectsSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-col space-y-2">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="w-full p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse space-y-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
            <div className="flex-1 flex items-center space-x-3">
              <div className="w-32 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
              <div className="w-24 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
            </div>
          </div>

          <div className="flex justify-between items-start w-full max-w-3xl p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse">
            <div className="flex-1 pr-4 space-y-3">
              <div className="h-8 w-2/3 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
              <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
              <div className="h-4 w-5/6 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
            </div>
            <div className="w-28 h-24 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-md flex-shrink-0"></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
            <div className="w-8 h-8 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProjectsSkeleton;
