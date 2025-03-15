import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/Loader';
import { UserContext } from '../App';

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    social_links: {},
    joinedAt: "",
}

const ProfilePage = () => {

    const { id: profileId } = useParams();

    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext);

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/user/profile", {
            username: profileId
        })
            .then(({ data: user }) => {
                setProfile(user);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })
    }

    useEffect(() => {
        resetState();
        fetchUserProfile();
    }, [profileId]);

    const resetState = () => {
        setProfile(profileDataStructure);
        setLoading(true);
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                        <div className='flex flex-col max-md:items-center gap-5 min-w-[250px]'>

                            <img src={profile_img} alt="" className='w-48 h-48 bg-gray-200 rounded-full md:w-32 md:h-32' />

                            <h1 className='text-2xl font-medium'>
                                @{profile_username}
                            </h1>
                            <p className='text-xl capitalize h-6'>
                                {fullname}
                            </p>

                            <p>{total_posts.toLocaleString()} Projects - {total_reads.toLocaleString()} Reads</p>

                            <div className='flex gap-4 mt-2'>
                                {
                                    profileId === username ?
                                        <Link to="/settings/edit-profile" className='btn-light rounded-md'>
                                            Edit Profile
                                        </Link> : ""
                                }
                            </div>

                        </div>
                    </section>
            }
        </AnimationWrapper>
    )
}

export default ProfilePage;
