import { useEffect, useState } from "react";
import { filterPaginationData } from "../../shared/requests/filter-pagination-data";
import Loader from "../../shared/components/atoms/loader";
import AnimationWrapper from "../../shared/components/atoms/page-animation";
import NoDataMessage from "../../shared/components/atoms/no-data-msg";
import LoadMoreDataBtn from "../../shared/components/molecules/load-more-data";
import NotificationCard from "./components/notificationCard";
import { notificationFilters } from "./constants";
import { useAtom } from "jotai";
import { UserAtom } from "../../shared/states/user";

const Notifications = () => {
  // let { userAuth, userAuth: { access_token, new_notification_available }, setUserAuth } = useContext(UserContext);
  const [user, setUser] = useAtom(UserAtom);

  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/get", { page, filter, deletedDocCount }, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(async ({ data: { notifications: data } }) => {
        if (user.new_notification_available) {
          setUser((prev) => ({ ...prev, new_notification_available: false }));
        }

        const formattedData = await filterPaginationData({
          state: notifications,
          data,
          page,
          countRoute: "/api/notification/all-count",
          data_to_send: { filter },
        })

        setNotifications(formattedData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 });
    }
  }, [access_token, filter]);

  const handleFilter = (e) => {
    const btn = e.target;
    setFilter(btn.innerHTML.toLowerCase());
    setNotifications(null);
  }

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {
          notificationFilters.map((filterName, i) => {
            return (
              <button
                key={i}
                className={"py-2 " + (filter === filterName ? "btn-dark" : "btn-light")}
                onClick={handleFilter}
              >
                {filterName}
              </button>
            )
          })
        }
      </div>

      {
        notifications === null ? <Loader /> :
          <>
            {
              notifications.results.length ?
                notifications.results.map((notification, i) => {
                  return (
                    <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                      <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
                    </AnimationWrapper>
                  )
                }) :
                <NoDataMessage message="Nothing available" />
            }

            <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalParam={{ deletedDocCount: notifications.deletedDocCount }} />

          </>
      }
    </div>
  )
}

export default Notifications;
