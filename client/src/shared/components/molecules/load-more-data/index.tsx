interface LoadMoreDataBtnProps {
  state: any;
  fetchDataFun: (params: any) => void;
  additionalParam?: any;
}

const LoadMoreDataBtn = ({
  state,
  fetchDataFun,
  additionalParam,
}: LoadMoreDataBtnProps) => {
  if (state && state.results && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchDataFun({ ...additionalParam, page: state.page + 1 })}
        className="text-gray-800 dark:text-gray-200 p-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
      >
        Load More
      </button>
    )
  }
}

export default LoadMoreDataBtn;
