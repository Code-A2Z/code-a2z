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

  const fetchUsers = useCallback(async (query: string, page: number = 1) => {
    if (query.trim() === '') {
      setUsers([]);
      return;
    }
    setIsLoadingUsers(true);
    try {
      const response = await searchUser(query, page);
      if (response.data && Array.isArray(response.data)) {
        const newUsers = response.data;
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
    (value: string) => {
      // If search is cleared, navigate to home without query params
      if (!value.trim().length) {
        navigate({ href: ROUTES_V1.HOME });
      }
    },
    [navigate]
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
    fetchUsers,
    fetchProjects,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchClear,
    searchTerm,
  };
};

export default useSearchV1;
