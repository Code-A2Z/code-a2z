import { Link } from 'react-router-dom';
import AnimationWrapper from '../../../atoms/page-animation';
import { removeFromSession } from '../../../../utils/session';
import { useAtom } from 'jotai';
import { UserAtom } from '../../../../states/user';
import { emptyUserState } from '../../../../states/emptyStates/user';

const UserNavigationPanel = () => {
  const [user, setUser] = useAtom(UserAtom);
  const signOutUser = () => {
    removeFromSession('user');
    setUser(emptyUserState);
  };

  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-[#fafafa] dark:bg-[#09090b] absolute right-0 border border-[#e5e7eb] dark:border-[#27272a] w-60 duration-200">
        <Link to={'/editor'} className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        <Link to={`/user/${user?.username}`} className="link pl-8 py-4">
          Profile
        </Link>

        <Link to="/dashboard/projects" className="link pl-8 py-4">
          Dashboard
        </Link>

        <Link to="/settings/edit-profile" className="link pl-8 py-4">
          Settings
        </Link>

        <span className="absolute border-t border-gray-200 w-[100%]"></span>

        <button
          className="text-left w-full pl-8 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#27272a] text-gray-800 dark:text-gray-100"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p className="text-gray-600">@{user?.username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
