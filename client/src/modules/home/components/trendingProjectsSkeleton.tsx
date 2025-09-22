const TrendingProjectsSkeleton = ({ count } : { count: number }) => {
  return (
    <div className="flex flex-col space-y-2">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="w-full p-4 bg-[#f5f5f5] dark:bg-[#151515] rounded-md animate-pulse space-y-4"
        >
          <div className="flex items-center space-x-4">
            <div className="size-10 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-xl"></div>
            <div className="size-10 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded-full"></div>
            <div className="flex-1 flex items-center space-x-3">
              <div className="w-32 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
              <div className="w-24 h-4 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
            </div>
          </div>

          <div className="h-8 w-2/3 ml-14 bg-[#d4d4d4] dark:bg-[#2a2a2a] rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default TrendingProjectsSkeleton;
