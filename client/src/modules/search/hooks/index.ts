import { useSetAtom } from 'jotai';
import { SearchPageUsersAtom } from '../states';
import { searchUser } from '../../../infra/rest/apis/user';

const useSearch = () => {
  const setUsers = useSetAtom(SearchPageUsersAtom);

  const fetchUsers = async (query: string, page: number = 1) => {
    if (query.trim() === '') {
      setUsers([]);
      return;
    }
    const response = await searchUser(query, page);
    if (response.data) {
      setUsers(response.data);
    }
  };

  return {
    fetchUsers,
  };
};

export default useSearch;
