import axios from "./CustomizeAxios";

const fetchAllUser = (page: unknown) => {
    return axios.get(`/api/users?page=${page}`);
}

const postCreateUser = (name: string, job: string) => {
    return axios.post("/api/users", { name, job });
}
const putEditUser = (name: string, job: string) => {
    return axios.put("/api/users/2", { name, job })
}

const deleteUser = (id: unknown) => {
    return axios.delete(`/api/users/${id}`)
}

const loginApi = (email, password) => {
    return axios.post("/api/login", { email, password })
}
export { fetchAllUser, postCreateUser, putEditUser, deleteUser, loginApi }