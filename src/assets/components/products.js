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
      await $http.post(path.check);
      this.getProduct();
    },
    async getProduct() {
      const res = await $http.get(`${path.admin}/products`);
      this.productList = res.data.products;
    },
    async addProduct() {
      const payload = { data: { ...this.tempProduct } };
      this.loading("正在新增中，請稍後");
      const res = await $http.post(`${path.admin}/product`, payload);
      // console.log(res.data.message);
      Swal.fire({
        icon: "success",
        text: res.data.message,
      });
      this.removeloading();
      await this.getProduct();
      this.closeModal();
    },
    async editProduct() {
      // this.tempProduct在當時接受product shallow copy時將id更新至this.tempProduct
      const { id } = this.tempProduct;
      delete this.tempProduct.id;
      const payload = { data: { ...this.tempProduct } };
      this.loading("修改中，請稍後");
      const res = await $http.put(`${path.admin}/product/${id}`, payload);
      console.log(res.data.message);
      Swal.fire({
        icon: "success",
        text: res.data.message,
      });
      this.removeloading();
      await this.getProduct();
      this.closeModal();
    },
    async deleteProduct() {
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
    },
    deleteCheck(product) {
      this.tempProduct = { ...product };
      delProductModal.show();
    },
    handleUpdateProduct() {
      if (this.productModalTitle === "新增產品") {
        this.addProduct();
      } else {
        this.editProduct();
      }
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
