import http from "../../configs/http/http-common";

// const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(user) {
    return http
      .post("/Users/Login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
  }

  register(user) {
    return http.post("/Users/Register", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
