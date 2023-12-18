const express = require("express");
// const { verify } = require("crypto");
const Func = require("../functions/functions");
const sequelize = require("../../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cache = require("../../config/node-cache");
const path = require("path");

// Controllers
const UserControllers = require("../controller/usersController");
const UserAddressControllers = require("../controller/usersAddressController");
const AdminControllers = require("../controller/adminController");
const CategoryControllers = require("../controller/categoryController");
const BrandsControllers = require("../controller/brandController");
const ProductControllers = require("../controller/productController");
const OrderControllers = require("../controller/orderCantroller");
const BannerControllers = require("../controller/bannerController");
const UserFavoritesControllers = require("../controller/userFavoritesController");
const ParametrControllers = require("../controller/parametrController");
const ProductParametrControllers = require("../controller/productParametrController");
const MarketControllers = require("../controller/marketController");
const CompareControllers = require("../controller/compareController");
const PostControllers = require("../controller/postController");

// For Token

const verifyToken = async (req, res, next) => {
  const bearerHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt?.verify(bearerToken, Func.Secret(), (err, authData) => {
      if (err) {
        res.json("err");
        console.log(err);
      } else {
        req.id = authData.id;
      }
    });
    next();
  } else {
    res.send("<center><h2>This link was not found! :(</h2></center>");
  }
};

// // Routes

// User Routes
router.get(
  "/user/all",
  verifyToken,
  cache.get,
  UserControllers.getAll,
  cache.set
);
router.get(
  "/user/:id",
  verifyToken,
  cache.get,
  UserControllers.getOne,
  cache.set
);
router.post("/user/create", UserControllers.create);
router.post("/user/create2", UserControllers.create2);
router.post("/user/login", UserControllers.login);
router.patch("/user/update", verifyToken, UserControllers.update);
router.patch("/user/disActive/:id", verifyToken, UserControllers.disActive);
router.patch("/user/active/:id", verifyToken, UserControllers.Active);
router.patch("/user/delete/:id", verifyToken, UserControllers.Delete);
router.delete("/user/destroy/:id", verifyToken, UserControllers.Destroy);
router.post("/user/check", UserControllers.checkCode);
router.post("/user/send", UserControllers.sendCode);

// User Address Routes
router.get(
  "/address/all",
  verifyToken,
  cache.get,
  UserAddressControllers.getAll,
  cache.set
);
router.get(
  "/address/:id",
  verifyToken,
  cache.get,
  UserAddressControllers.getOne,
  cache.set
);
router.post("/address/create", verifyToken, UserAddressControllers.create);
router.patch("/address/update", verifyToken, UserAddressControllers.update);
router.delete(
  "/address/destroy/:id",
  verifyToken,
  UserAddressControllers.Destroy
);

// Admin Routes
router.get(
  "/admin/all",
  // verifyToken,
  cache.get,
  AdminControllers.getAll,
  cache.set
);
router.get(
  "/admin/:id",
  verifyToken,
  cache.get,
  AdminControllers.getOne,
  cache.set
);
router.post("/admin/create", AdminControllers.create);
router.post("/admin/login", AdminControllers.login);
router.patch("/admin/update", verifyToken, AdminControllers.update);
router.patch("/admin/disActive/:id", verifyToken, AdminControllers.disActive);
router.patch("/admin/active/:id", verifyToken, AdminControllers.Active);
router.patch("/admin/delete/:id", verifyToken, AdminControllers.Delete);
router.delete("/admin/destroy/:id", verifyToken, AdminControllers.Destroy);
router.post("/admin/check", AdminControllers.checkCode);

//   Categories Routes
router.get("/category/all", cache.get, CategoryControllers.getAll, cache.set);
router.get("/category/:id", cache.get, CategoryControllers.getOne, cache.set);
router.post("/category/create", verifyToken, CategoryControllers.create);
router.patch("/category/update", verifyToken, CategoryControllers.update);
router.patch("/category/delete/:id", verifyToken, CategoryControllers.Delete);
router.patch(
  "/category/unDelete/:id",
  verifyToken,
  CategoryControllers.unDelete
);
router.delete(
  "/category/destroy/:id",
  verifyToken,
  CategoryControllers.Destroy
);

// Brands Routes
router.get("/brand/all", cache.get, BrandsControllers.getAll, cache.set);
router.get("/brand/:id", cache.get, BrandsControllers.getOne, cache.set);
router.post("/brand/create", verifyToken, BrandsControllers.create);
router.patch("/brand/update", verifyToken, BrandsControllers.update);
router.patch("/brand/delete/:id", verifyToken, BrandsControllers.Delete);
router.patch("/brand/unDelete/:id", verifyToken, BrandsControllers.unDelete);
router.delete("/brand/destroy/:id", verifyToken, BrandsControllers.Destroy);

// Products Routes
router.get("/product/all", cache.get, ProductControllers.getAll, cache.set);
router.get("/product/:id", cache.get, ProductControllers.getOne, cache.set);
router.post("/product/create", verifyToken, ProductControllers.create);
router.post("/product/upl-img/:id", verifyToken, ProductControllers.uploadsImg);
router.post(
  "/product/upl-video/:id",
  verifyToken,
  ProductControllers.uploadsVideo
);
router.delete(
  "/product/del-img/:id",
  verifyToken,
  ProductControllers.deleteProductImg
);
router.delete(
  "/product/del-video/:id",
  verifyToken,
  ProductControllers.deleteProductVideo
);
router.patch("/product/update", verifyToken, ProductControllers.update);
router.patch("/product/delete/:id", verifyToken, ProductControllers.Delete);
router.patch("/product/unDelete/:id", verifyToken, ProductControllers.unDelete);
router.delete("/product/destroy/:id", verifyToken, ProductControllers.Destroy);

// Order Routes
router.get("/order/all", cache.get, OrderControllers.getAll, cache.set);
router.get("/order/:id", cache.get, OrderControllers.getOne, cache.set);
router.post("/order/create", OrderControllers.create);
router.patch("/order/update", verifyToken, OrderControllers.update);
router.patch("/order/delete/:id", OrderControllers.Delete);
router.patch("/order/unDelete/:id", OrderControllers.unDelete);
router.delete("/order/destroy/:id", verifyToken, OrderControllers.Destroy);

// Banner Routes
router.get("/banner/all", cache.get, BannerControllers.getAll, cache.set);
router.get("/banner/:id", cache.get, BannerControllers.getOne, cache.set);
router.post("/banner/create", verifyToken, BannerControllers.create);
router.patch("/banner/update", verifyToken, BannerControllers.update);
router.delete("/banner/destroy/:id", verifyToken, BannerControllers.Destroy);

// User Favorites Routes
router.get(
  "/favorite/all",
  // verifyToken,
  cache.get,
  UserFavoritesControllers.getAll,
  cache.set
);
router.get(
  "/favorite/:id",
  verifyToken,
  cache.get,
  UserFavoritesControllers.getOne,
  cache.set
);
router.post("/favorite/create", verifyToken, UserFavoritesControllers.create);
router.patch("/favorite/update", verifyToken, UserFavoritesControllers.update);
router.delete(
  "/favorite/destroy/:id",
  verifyToken,
  UserFavoritesControllers.Destroy
);

// Parametr Routes
router.get("/parametr/all", cache.get, ParametrControllers.getAll, cache.set);
router.get("/parametr/:id", cache.get, ParametrControllers.getOne, cache.set);
router.post("/parametr/create", verifyToken, ParametrControllers.create);
router.patch("/parametr/update", verifyToken, ParametrControllers.update);
router.patch("/parametr/delete/:id", verifyToken, ParametrControllers.Delete);
router.patch(
  "/parametr/unDelete/:id",
  verifyToken,
  ParametrControllers.unDelete
);
router.delete(
  "/parametr/destroy/:id",
  verifyToken,
  ParametrControllers.Destroy
);

//  ProductParametrItem routes
router.get(
  "/product/items",
  cache.get,
  ProductParametrControllers.getAll,
  cache.set
);
router.get(
  "/product/item/:id",
  cache.get,
  ProductParametrControllers.getOne,
  cache.set
);
router.post(
  "/product/item/create",
  verifyToken,
  ProductParametrControllers.create
);
router.patch(
  "/product/item/update",
  verifyToken,
  ProductParametrControllers.update
);
router.patch(
  "/product/item/delete/:id",
  verifyToken,
  ProductParametrControllers.Delete
);
router.patch(
  "/product/item/undelete/:id",
  verifyToken,
  ProductParametrControllers.unDelete
);
router.delete(
  "/product/item/destroy/:id",
  verifyToken,
  ProductParametrControllers.Destroy
);

// ProductParametr routes

router.get(
  "/product/parametr",
  cache.get,
  ProductParametrControllers.getAllPP,
  cache.set
);
router.get(
  "/product/parametr/:id",
  cache.get,
  ProductParametrControllers.getOnePP,
  cache.set
);
router.post(
  "/product/parametr/create",
  verifyToken,
  ProductParametrControllers.createPP
);
router.patch(
  "/product/parametr/update",
  verifyToken,
  ProductParametrControllers.updatePP
);
router.patch(
  "/product/parametr/delete/:id",
  verifyToken,
  ProductParametrControllers.DeletePP
);
router.patch(
  "/product/parametr/undelete/:id",
  verifyToken,
  ProductParametrControllers.unDeletePP
);
router.delete(
  "/product/parametr/destroy/:id",
  verifyToken,
  ProductParametrControllers.DestroyPP
);

// Market Config Routes

router.get("/market/all", cache.get, MarketControllers.getAll, cache.set);
router.get("/market/:id", cache.get, MarketControllers.getOne, cache.set);
router.post("/market/create", verifyToken, MarketControllers.create);
router.patch("/market/update", verifyToken, MarketControllers.update);
router.delete("/market/destroy/:id", verifyToken, MarketControllers.Destroy);

// Post Rotes
router.get("/post/all", cache.get, PostControllers.getAll, cache.set);
router.get("/post/:id", cache.get, PostControllers.getOne, cache.set);
router.post("/post/create", PostControllers.create);
router.patch("/post/update", verifyToken, PostControllers.update);
router.delete("/post/destroy/:id", verifyToken, PostControllers.Destroy);

// Compare Config Routes

router.get("/compare/all", cache.get, CompareControllers.getAll, cache.set);
router.get(
  "/compare/allByPro",
  cache.get,
  CompareControllers.getAllByPro,
  cache.set
);
router.get("/compare/:id", cache.get, CompareControllers.getOne, cache.set);
router.post("/compare/create", verifyToken, CompareControllers.create);
router.post("/compare/addPro", verifyToken, CompareControllers.addPro);
router.delete(
  "/compare/removePro/:id",
  verifyToken,
  CompareControllers.removePro
);
router.patch("/compare/update", verifyToken, CompareControllers.update);
router.delete("/compare/destroy/:id", verifyToken, CompareControllers.Destroy);

module.exports = router;
