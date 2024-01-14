import "../helpers/axios.min.js";
const baseURL = "https://vue3-course-api.hexschool.io/v2";
// const base = "https://ec-course-api.hexschool.io/v2";
const api_path = "gingene-test";

const path = {
  signin: "/admin/signin",
  logout: "/logout",
  check: "/api/user/check",
  admin: `/api/${api_path}/admin`,
  guest: `/api/${api_path}`,
};

const $http = axios.create({
  baseURL,
});

$http.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      config.headers.Authorization = token;
    }
    return config; //必須回傳config，否則axios會拋出錯誤
  },
  (err) => {
    return Promise.reject(err);
  }
);

$http.interceptors.response.use(
  (res) => {
    // switch (res.data.status) {
    //   case 200:
    //     // return Promise.resolve(res);
    //     return res;
    //   default:
    //     console.log(res);
    // }
    // console.log(res);
    return res;
  },
  (err) => {
    console.log(err);
    Swal.fire({
      icon: "error",
      text: err.response.data.message,
    });
    return Promise.reject(
      `狀態碼${err.request.status} 錯誤訊息${err.response.data.message}`
    ); //必須回傳err，否則axios會拋出錯誤
  }
);

export { $http, path };
