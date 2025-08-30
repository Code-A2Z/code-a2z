const NoDataMessage = ({ message }: { message: string }) => {
  return (
    <div className="text-center w-full p-4 rounded-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 mt-4">
      <p>{message}</p>
    </div>
  );
};

export default NoDataMessage;
