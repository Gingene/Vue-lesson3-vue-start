import { createApp } from "../../vue/vue.esm-browser.min.js";
import { $http, path } from "../api/config.js";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await $http.post(path.signin, this.user);
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token};expires=${new Date(
          expired
        )};path=/`;
        location.href = "product.html";
      } catch (err) {
        console.error(err);
        alert(err.response.data.message);
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      location.href = "product.html";
    }
  },
});

app.mount("#app");
