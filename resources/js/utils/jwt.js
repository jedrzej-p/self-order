export function getToken() {
    return window.localStorage.getItem("token");
}

export function login(token) {
    window.localStorage.setItem("token", token);
}

export function logout() {
    axios.post("/api/logout")
        .then(() => {
            window.localStorage.removeItem("token");
            window.location.replace("/");
        });
}

export function isLoggedIn() {
    const token = getToken();
    return token !== null;
}
