import { createApp } from "../../vue/vue.esm-browser.min.js";
import { $http, path } from "../api/config.js";

let addProductModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      productList: [],
      tempProduct: {
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
        imagesUrl: [""],
      },
      productModalTitle: "",
    };
  },
  methods: {
    async checkAdmin() {
      try {
        await $http.post(path.check);
        this.getProduct();
      } catch (err) {
        Swal.fire({
          icon: "error",
          text: "請先登入",
        });

        location.href = "index.html";
      }
    },
    async getProduct() {
      const res = await $http.get(`${path.admin}/products`);
      this.productList = res.data.products;
    },
    async updateProduct() {
      try {
        let url = `${path.admin}/product`;
        let http = "post";

        if (this.productModalTitle !== "新增產品") {
          url = `${path.admin}/product/${this.tempProduct.id}`;
          http = "put";
        }

        const payload = { data: { ...this.tempProduct } };
        this.loading(
          this.productModalTitle === "新增產品"
            ? "正在新增中，請稍後"
            : "修改中，請稍後"
        );
        const res = await $http[http](url, payload);
        Swal.fire({
          icon: "success",
          text: res.data.message,
        });
        this.closeModal();
        await this.getProduct();
        this.removeloading();
      } catch (err) {
        this.removeloading();
      }
    },
    async deleteProduct() {
      try {
        this.loading("刪除產品中，請稍後");
        const { id } = this.tempProduct;
        const res = await $http.delete(`${path.admin}/product/${id}`);
        Swal.fire({
          icon: "success",
          text: res.data.message,
        });
        this.removeloading();
        await this.getProduct();
        delProductModal.hide();
      } catch (err) {
        this.removeloading();
        delProductModal.hide();
      }
    },
    deleteCheck(product) {
      this.tempProduct = { ...product };
      delProductModal.show();
    },
    handleErrorImageUrl() {
      // this.imageError = "錯誤連結";
      // this.tempProduct.imagesUrl = [""];
      console.error("錯誤連結");
    },
    resetProduct() {
      this.tempProduct = {
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
        imagesUrl: [""],
      };
    },
    openModal(title, product) {
      this.productModalTitle = title;
      if (product) {
        this.tempProduct = { ...this.tempProduct, ...product };
      } else {
        this.resetProduct();
      }
      addProductModal.show();
    },
    closeModal() {
      addProductModal.hide();
    },
    loading(msg) {
      this.$refs.load.classList.remove("d-none");
      this.$refs.load.childNodes[0].childNodes[0].textContent = msg;
    },
    removeloading() {
      this.$refs.load.classList.add("d-none");
    },
  },
  mounted() {
    this.checkAdmin();
    addProductModal = new bootstrap.Modal(this.$refs.productModal);
    delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
  },
});

app.mount("#app");
