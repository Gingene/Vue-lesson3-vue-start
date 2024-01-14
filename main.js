const locationPath = location.pathname;

const path = {
  local: {
    home: ["/", "/index.html"],
    product: "/product.html",
  },
  server: {
    home: [
      "/Vue-lesson2-RESTful_API-request/",
      "/Vue-lesson2-RESTful_API-request/index.html",
    ],
    product: "/Vue-lesson2-RESTful_API-request/product.html",
  },
};

if (
  locationPath === path.local.home[0] ||
  locationPath === path.local.home[1] ||
  locationPath === path.server.home[0] ||
  locationPath === path.server.home[1]
) {
  import("./src/assets/components/login.js");
} else if (
  locationPath === path.local.product ||
  locationPath === path.server.product
) {
  import("./src/assets/components/products.js");
}
