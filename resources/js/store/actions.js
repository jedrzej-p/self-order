export default {
    getLoggedUser({ commit }) {
        return axios.get("/api/user/get-logged-user")
            .then(({ data }) => {
                commit("setLoggedUser", { data });
            });
    },
};
