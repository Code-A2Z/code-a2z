import { useCallback, useMemo, useState } from 'react';
import { searchUser } from '../../../../../../infra/rest/apis/user';
import { searchUserResponse } from '../../../../../../infra/rest/apis/user/typing';
import { searchProjects } from '../../../../../../infra/rest/apis/project';
import { useSetAtom } from 'jotai';
import { HomePageProjectsAtom } from '../../../../v1/states';
import { ROUTES_V1 } from '../../../../../../app/routes/constants/routes';
import { HOME_QUERY_PARAMS } from '../../../../routes';
import { useCustomNavigate } from '../../../../../../shared/hooks/use-custom-navigate';
import { useSearchParams } from 'react-router-dom';

const useSearchV1 = () => {
  const [searchParams] = useSearchParams();
  const navigate = useCustomNavigate();
  const setProjects = useSetAtom(HomePageProjectsAtom);
  const [users, setUsers] = useState<searchUserResponse[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  const fetchUsers = useCallback(async (query: string, page: number = 1) => {
    if (query.trim() === '') {
      setUsers([]);
      setHasMoreUsers(true);
      return;
    }
    setIsLoadingUsers(true);
    try {
      const response = await searchUser(query, page);
      if (response.data && Array.isArray(response.data)) {
        const newUsers = response.data;
        // Check if there are more users to load
        setHasMoreUsers(newUsers.length === 10);
        // Append new users for pagination, replace for new search
        if (page === 1) {
          setUsers(newUsers);
        } else {
          setUsers(prevUsers => [...prevUsers, ...newUsers]);
        }
      }
    } catch (error) {
      console.error('Error fetching search users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const fetchProjects = useCallback(
    async (query: string, page: number = 1) => {
      if (!query.trim()) {
        setProjects([]);
        setHasMoreProjects(true);
        return;
      }
      setIsLoadingProjects(true);
      try {
        const response = await searchProjects({
          query,
          page,
          limit: 10,
        });
        if (response.data && Array.isArray(response.data)) {
          const newProjects = response.data;
          // Check if there are more projects to load
          setHasMoreProjects(newProjects.length === 10);
          if (page === 1) {
            setProjects(newProjects);
          } else {
            setProjects(prevProjects => [...prevProjects, ...newProjects]);
          }
        }
      } catch (error) {
        console.error('Error fetching search projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    },
    [setProjects]
  );

  const handleSearchChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_value: string) => {
      // Intentionally left blank: navigation is handled on submit and clear actions
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (value: string) => {
      if (!value.trim().length) {
        navigate({ href: ROUTES_V1.HOME });
        return;
      }
      navigate({
        pathname: ROUTES_V1.HOME,
        search: `?${HOME_QUERY_PARAMS.SEARCH_TERM}=${encodeURIComponent(value)}`,
      });
    },
    [navigate]
  );

  const handleSearchClear = useCallback(() => {
    navigate({ href: ROUTES_V1.HOME });
  }, [navigate]);

  const searchTerm = useMemo(() => {
    const term = searchParams.get(HOME_QUERY_PARAMS.SEARCH_TERM);
    return term ? decodeURIComponent(term) : '';
  }, [searchParams]);

  return {
    users,
    isLoadingProjects,
    isLoadingUsers,
    hasMoreUsers,
    hasMoreProjects,
    fetchUsers,
    fetchProjects,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    searchTerm,
    setUsers,
  };
};

export default useSearchV1;
