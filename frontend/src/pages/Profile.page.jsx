// root packages 
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// common files 
import AnimationWrapper from '../common/page-animation';
import { filterPaginationData } from '../common/filter-pagination-data';

// components files 
import Loader from '../components/Loader';
import AboutUser from '../components/aboutUser.component';
import InPageNavigation from '../components/inPageNavigation.component';
import ProjectPostCard from '../components/projectPostCard.component';
import NoDataMessage from '../components/noData.component';
import LoadMoreDataBtn from '../components/LoadMoreData';

// pages files 
import PageNotFound from './404.page';

// src files 
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
    let [projects, setProjects] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext);

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/user/profile", {
            username: profileId
        })
            .then(({ data: user }) => {
                if(user !== null) {
                    setProfile(user);
                    getProjects({ user_id: user._id });
                }
                setProfileLoaded(profileId);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })
    }

    const getProjects = ({ page = 1, user_id }) => {
        user_id = user_id == undefined ? projects.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/project/search", {
            author: user_id,
            page
        })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: projects,
                    data: data.projects,
                    page,
                    countRoute: "/api/project/search-count",
                    data_to_send: { author: user_id }
                })

                formattedData.user_id = user_id;
                setProjects(formattedData);
            })
    }

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setProjects(null);
        }
        if (projects === null) {
            resetState();
            fetchUserProfile();
        }
    }, [profileId, projects]);

    const resetState = () => {
        setProfile(profileDataStructure);
        setLoading(true);
        setProfileLoaded("");
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    profile_username.length ?
                        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                            <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-gray-300 md:sticky md:top[100px] md:py-10'>

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

                                <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />

                            </div>

                            <div className='max-wd-:mt-12 w-full'>
                                <InPageNavigation routes={["Projects Published", "About"]} defaultHidden={["About"]}>
                                    <>
                                        {
                                            projects === null ? (
                                                <Loader />
                                            ) : (
                                                projects && projects.results.length ?
                                                    projects.results.map((project, i) => {
                                                        return (
                                                            <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                                <ProjectPostCard content={project} author={project.author.personal_info} />
                                                            </AnimationWrapper>
                                                        )
                                                    })
                                                    : <NoDataMessage message="No projects published" />
                                            )
                                        }
                                        <LoadMoreDataBtn state={projects} fetchDataFun={getProjects} />
                                    </>

                                    <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                                </InPageNavigation>

                            </div>
                        </section> :
                        <PageNotFound />
            }
        </AnimationWrapper>
    )
}

export default ProfilePage;
