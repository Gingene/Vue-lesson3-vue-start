import {
  createApp,
  onMounted,
  reactive,
} from "../../vue/vue.esm-browser.min.js";
import { $http, path } from "../api/config.js";

const app = createApp({
  setup() {
    const user = reactive({
      username: "",
      password: "",
    });

    async function handleLogin() {
      try {
        const res = await $http.post(path.signin, user);
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token};expires=${new Date(
          expired
        )};path=/`;
        location.href = "product.html";
      } catch (err) {
        console.error(err);
        alert(err.response.data.message);
      }
    }

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if (token) {
        location.href = "product.html";
      }
    });

    return { user, handleLogin };
  },
});

app.mount("#app");
