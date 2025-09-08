import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {}, user = undefined }: {
    create_new_arr?: boolean;
    state: any;
    data: any;
    page: number;
    countRoute: string;
    data_to_send?: any;
    user?: string;
}) => {

    let obj: any;

    let headers: { headers?: { Authorization: string } } = {};

    if (user) {
        headers.headers = {
            Authorization: `Bearer ${user}`
        }
    }

    if (state !== null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data], page: page }
    } else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send, headers)
            .then(({ data: { totalDocs } }) => {
                obj = { results: data, page: 1, totalDocs }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return obj;
}