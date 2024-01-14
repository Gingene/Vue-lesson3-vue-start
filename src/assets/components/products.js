import { createApp, onMounted, ref } from "../../vue/vue.esm-browser.min.js";
import { $http, path } from "../api/config.js";

let addBsProductModal = null;
let delBsProductModal = null;

const app = createApp({
  setup() {
    const productList = ref([]);
    const tempProduct = ref({
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
    });
    const productModalTitle = ref("");

    const data = { productList, tempProduct, productModalTitle };

    // refs
    const load = ref(null);
    const productModal = ref(null);
    const delProductModal = ref(null);

    const refs = { load, productModal, delProductModal };

    const checkAdmin = async () => {
      try {
        await $http.post(path.check);
        getProduct();
      } catch (err) {
        Swal.fire({
          icon: "error",
          text: "請先登入",
        });

        location.href = "index.html";
      }
    };

    const getProduct = async () => {
      const res = await $http.get(`${path.admin}/products`);
      productList.value = res.data.products;
    };

    const resetProduct = () => {
      tempProduct.value = {
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
    };
    const addProduct = async () => {
      try {
        const payload = { data: { ...tempProduct.value } };
        loading("正在新增中，請稍後");
        const res = await $http.post(`${path.admin}/product`, payload);
        // console.log(res.data.message);
        Swal.fire({
          icon: "success",
          text: res.data.message,
        });
        removeloading();
        await getProduct();
        closeModal();
      } catch (err) {
        removeloading();
      }
    };

    const editProduct = async () => {
      // tempProduct在當時接受product shallow copy時將id更新至this.tempProduct
      try {
        const { id } = tempProduct.value;
        delete tempProduct.id;
        const payload = { data: { ...tempProduct.value } };
        loading("修改中，請稍後");
        const res = await $http.put(`${path.admin}/product/${id}`, payload);
        Swal.fire({
          icon: "success",
          text: res.data.message,
        });
        removeloading();
        await getProduct();
        closeModal();
      } catch (err) {
        removeloading();
      }
    };

    const deleteProduct = async () => {
      try {
        loading("刪除產品中，請稍後");
        const { id } = tempProduct.value;
        const res = await $http.delete(`${path.admin}/product/${id}`);
        Swal.fire({
          icon: "success",
          text: res.data.message,
        });
        removeloading();
        await getProduct();
        delBsProductModal.hide();
      } catch (err) {
        removeloading();
        delBsProductModal.hide();
      }
    };

    const productMethods = {
      checkAdmin,
      resetProduct,
      getProduct,
      addProduct,
      editProduct,
      deleteProduct,
    };
    // Dom
    const deleteCheck = (product) => {
      tempProduct.value = { ...product };
      delBsProductModal.show();
    };

    const handleUpdateProduct = () => {
      if (productModalTitle.value === "新增產品") {
        addProduct();
      } else {
        editProduct();
      }
    };

    const handleErrorImageUrl = () => {
      // this.imageError = "錯誤連結";
      // this.tempProduct.imagesUrl = [""];
      console.error("錯誤連結");
    };
    const domMethods = {
      deleteCheck,
      handleUpdateProduct,
      handleErrorImageUrl,
    };

    const openModal = (title, product) => {
      productModalTitle.value = title;
      if (product) {
        tempProduct.value = product;
      } else {
        resetProduct();
      }
      addBsProductModal.show();
    };

    const closeModal = () => {
      addBsProductModal.hide();
    };

    const modalMethods = {
      openModal,
      closeModal,
    };

    const loading = (msg) => {
      load.value.classList.remove("d-none");
      load.value.childNodes[0].childNodes[0].textContent = msg;
    };

    const removeloading = () => {
      load.value.classList.add("d-none");
    };

    const loadingMethods = {
      loading,
      removeloading,
    };

    onMounted(() => {
      checkAdmin();
      addBsProductModal = new bootstrap.Modal(productModal.value);
      delBsProductModal = new bootstrap.Modal(delProductModal.value);
    });

    return {
      ...data,
      ...refs,
      ...productMethods,
      ...domMethods,
      ...modalMethods,
      ...loadingMethods,
    };
  },
});

app.mount("#app");
