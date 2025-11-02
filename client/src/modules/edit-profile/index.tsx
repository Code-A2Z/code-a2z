import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { UserAtom } from '../../infra/states/user';
import { ProfileAtom } from '../profile/states';
import { useNotifications } from '../../shared/hooks/use-notification';
import { bioLimit } from './constants';
import { useAuth } from '../../shared/hooks/use-auth';

const EditProfile = () => {
  const [user, setUser] = useAtom(UserAtom);
  const [profile, setProfile] = useAtom(ProfileAtom);
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();

  const profileImgEle = useRef<HTMLImageElement>(null);
  const editProfileForm = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [charactersLeft, setCharactersLeft] = useState<number>(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState<File | null>(null);

  const {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profile;

  useEffect(() => {
    if (isAuthenticated()) {
      getUserProfile(user?.personal_info.username)
        .then(response => {
          setProfile(response);
          setLoading(false);
        })
        .catch(({ response }) => {
          console.log(response.data);
          setLoading(false);
        });
    }
  }, [user?.personal_info.username, setProfile, isAuthenticated]);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersLeft(bioLimit - e.currentTarget.value.length);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.currentTarget.files?.[0];
    if (profileImgEle.current && img) {
      profileImgEle.current.src = URL.createObjectURL(img);
      setUpdatedProfileImg(img);
    }
  };

  const handleImageUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (updatedProfileImg) {
      e.currentTarget.setAttribute('disabled', 'true');

      uploadImage(updatedProfileImg)
        .then(url => {
          if (url) {
            uploadProfileImage(url)
              .then(response => {
                const newUser = { ...user, profile_img: response.profile_img };
                storeInSession('user', JSON.stringify(newUser));
                setUser(newUser);

                setUpdatedProfileImg(null);
                e.currentTarget.removeAttribute('disabled');
                addNotification({
                  message: 'Profile Image Updated',
                  type: 'success',
                });
              })
              .catch(({ response }) => {
                e.currentTarget.removeAttribute('disabled');
                addNotification({
                  message: response.data.error,
                  type: 'error',
                });
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editProfileForm.current) return;
    const form = new FormData(editProfileForm.current);
    const formData: { [key: string]: FormDataEntryValue } = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;

    if (typeof username !== 'string' || username.length < 3) {
      return addNotification({
        message: 'Username should be atleast 3 characters long',
        type: 'error',
      });
    }

    if (typeof bio === 'string' && bio.length > bioLimit) {
      return addNotification({
        message: `Bio should be less than ${bioLimit} characters`,
        type: 'error',
      });
    }

    e.currentTarget.setAttribute('disabled', 'true');

    updateProfile(
      username,
      bio as string,
      youtube as string,
      facebook as string,
      twitter as string,
      github as string,
      instagram as string,
      website as string
    )
      .then(response => {
        if (user.username != response.username) {
          const newUserAuth = { ...user, username: response.username };
          storeInSession('user', JSON.stringify(newUserAuth));
          setUser(newUserAuth);
        }

        e.currentTarget.removeAttribute('disabled');
        addNotification({
          message: 'Profile Updated',
          type: 'success',
        });
      })
      .catch(({ response }) => {
        e.currentTarget.removeAttribute('disabled');
        addNotification({
          message: response.data.error,
          type: 'error',
        });
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm} onSubmit={handleSubmit}>
          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:block max-lg:mx-auto mb-5">
              <label
                htmlFor="uploadImg"
                id="profileImgLabel"
                className="relative block w-48 h-48 bg-gray-100 rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
                <img ref={profileImgEle} src={profile_img} alt="" />
              </label>

              <input
                onChange={handleImagePreview}
                type="file"
                id="uploadImg"
                accept=".jpeg, .png, .jpg"
                hidden
              />

              <button
                onClick={handleImageUpload}
                className="btn-light mt-5 max-lg:block max-lg:mx-auto lg:w-full px-10"
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <InputBox
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="Full Name"
                    disable={true}
                    icon="fi-rr-user"
                  />
                </div>
                <div>
                  <InputBox
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Email"
                    disable={true}
                    icon="fi-rr-envelope"
                  />
                </div>
              </div>

              <InputBox
                type="text"
                name="username"
                value={profile_username}
                placeholder="Username"
                icon="fi-rr-at"
              />

              <p className="text-gray-500 -mt-3">
                Username will use to search user and will be visible to all
                users
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={handleCharacterChange}
              ></textarea>

              <p className="mt-1 text-gray-500">
                {charactersLeft} characters Left
              </p>

              <p className="my-6 text-gray-500">Add your social handle below</p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {(
                  Object.keys(social_links) as Array<keyof typeof social_links>
                ).map((key, i) => {
                  const link = social_links[key];

                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={
                        key !== 'website' ? 'fi-brands-' + key : 'fi-rr-globe'
                      }
                    />
                  );
                })}
              </div>

              <button className="btn-dark w-auto px-10" type="submit">
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default EditProfile;
