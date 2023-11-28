var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Order,
  OrderProduct,
  User,
  Parametr,
  ProductParametrItem,
  ProductParametr,
  Product,
  ProductImg,
  ProductVideo,
  Category,
  Brand,
  Orderlog,
} = require("../../models");

const fs = require("fs");
const orderlog = require("../../models/orderlog");

const getAll = async (req, res) => {
  const { status, code, admin_note, active, deleted, UserId, name } = req.query;

  const Name =
    name && name.length > 0
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${name}%` } },
            { lastname: { [Op.iLike]: `%${name}%` } },
            { phone: { [Op.iLike]: `%${name}%` } },
            { note: { [Op.iLike]: `%${name}%` } },
            { address: { [Op.iLike]: `%${name}%` } },
          ],
        }
      : null;
  const UserID = UserId ? { UserId: UserId } : null;
  const Status =
    status &&
    (status?.length > 0
      ? {
          status: { [Op.iLike]: `%${status}%` },
        }
      : null);
  const Code =
    code &&
    (code?.length > 0
      ? {
          code: { [Op.iLike]: `%${code}%` },
        }
      : null);
  const Admin_note =
    admin_note &&
    (admin_note?.length > 0
      ? {
          admin_note: { [Op.iLike]: `%${admin_note}%` },
        }
      : null);
  const Active =
    active &&
    (active
      ? {
          active: active,
        }
      : {
          active: true,
        });
  const Deleted =
    deleted &&
    (deleted
      ? {
          deleted: deleted,
        }
      : {
          deleted: false,
        });

  Order.findAll({
    include: [
      {
        model: User,
      },
      {
        model: OrderProduct,
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductImg,
              },
              {
                model: ProductVideo,
              },
              {
                model: Category,
              },
              {
                model: Brand,
              },
              {
                model: Brand,
              },
              {
                model: ProductParametr,
                include: [
                  { model: Product },
                  { model: Parametr },
                  { model: ProductParametrItem },
                ],
              },
            ],
          },
        ],
      },
    ],

    where: {
      [Op.and]: [Status, Name, UserID, Code, Admin_note, Active, Deleted],
    },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};
const getOne = async (req, res) => {
  const { id } = req.params;
  const data = await Product.findOne({ where: { id: id } });
  if (data) {
    Order.findOne({
      include: [
        {
          model: User,
        },
        {
          model: OrderProduct,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImg,
                },
                {
                  model: ProductVideo,
                },
                {
                  model: Category,
                },
                {
                  model: Brand,
                },
                {
                  model: Brand,
                },
                {
                  model: ProductParametr,
                  include: [
                    { model: Product },
                    { model: Parametr },
                    { model: ProductParametrItem },
                  ],
                },
              ],
            },
          ],
        },
      ],

      where: { id: id },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.send("BU ID boyuncha Product yok!");
  }
};

const create = async (req, res) => {
  const {
    name,
    lastname,
    phone,
    address,
    note,
    admin_note,
    delivery_type,
    UserId,
    orderProduct,
  } = req.body;

  let orderedProducts = [];
  let price = 0;
  let discount_price = 0;
  await orderProduct?.map(async (item) => {
    const product = await Product.findOne({ where: { id: item.ProductId } });

    let proPrice = product?.is_valyuta
      ? (product?.usd_price * 19.4 * item?.quantity).toFixed(2)
      : (product?.price * item?.quantity).toFixed(2);
    price = price + proPrice;

    let proDiscount_price = product?.is_valyuta
      ? (product?.usd_price_discount * 19.4 * item?.quantity).toFixed(2)
      : (product?.discount_price * item?.quantity).toFixed(2);
    discount_price = discount_price + proDiscount_price;

    orderedProducts.push({
      quantity: item?.quantity,
      price: proPrice,
      discount_price: proDiscount_price,
      ProductId: product?.id,
      OrderId: 0,
    });
  });

  Order.create({
    price: price,
    discount_price: discount_price,
    delivery_price: 0,
    sum_price: price - discount_price,
    name,
    lastname,
    phone,
    address,
    note,
    admin_note,
    delivery_type,
    UserId,
  })
    .then(async (data) => {
      await orderedProducts?.map(async (item) => {
        item.OrderId = data.id;
      });
      await editStock(orderedProducts);
      OrderProduct.bulkCreate(orderedProducts, { returning: true })
        .then(async (ordered) => {
          res.json({ order: data, orderedPro: ordered });
        })
        .catch((err) => {
          console.log(err);
          res.json("create OrderedPro:", err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json("create Order:", err);
    });
};

const update = async (req, res) => {
  const { status, code, address, note, admin_note, id } = req.body;

  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id: id },
  });
  if (status == "0") {
    editStockCancelOrder(data.OrderProduct);
  }
  if (!data) {
    res.json("Bu Id boyuncha Product yok!");
  } else {
    Order.update(
      {
        status,
        code,
        address,
        note,
        admin_note,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async () => {
        res.json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update Order:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.update({
      deleted: false,
      active: true,
      where: {
        id,
      },
    })
      .then(async () => {
        // await Orderlog.create({
        //   ipAddress: "",
        //   description: "Order undeleted",
        //   edited: JSON.stringify(data),
        //   oldData: JSON.stringify(data),
        //   OrderId: id,
        //   MarketId: data?.MarketId,
        //   // UserId:
        //   // AdminId:
        // });
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.update({
      deleted: true,
      active: false,
      where: {
        id,
      },
    })
      .then(async () => {
        // await Orderlog.create({
        //   ipAddress: "",
        //   description: "Order deleted",
        //   edited: JSON.stringify(data),
        //   oldData: JSON.stringify(data),
        //   OrderId: id,
        //   MarketId: data?.MarketId,
        //   // UserId:
        //   // AdminId:
        // });
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.destroy({
      where: {
        id,
      },
    })
      .then(async () => {
        // await Orderlog.create({
        //   ipAddress: "",
        //   description: "Order destroyed",
        //   edited: JSON.stringify(data),
        //   oldData: JSON.stringify(data),
        //   OrderId: id,
        //   MarketId: data?.MarketId,
        //   // UserId:
        //   // AdminId:
        // });
        res.json("destroyed!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};

const editStock = async (orderedPro) => {
  await orderedPro.map(async (item) => {
    const pro = await Product.findOne({ where: { id: item.ProductId } });
    if (pro.stock == item.quantity) {
      await Product.update(
        { stock: pro.stock - item.quantity, active: false },
        { where: { id: item.ProductId } }
      );
    } else {
      await Product.update(
        { stock: pro.stock - item.quantity },
        { where: { id: item.ProductId } }
      );
    }
  });
};

const editStockCancelOrder = async (orderedPro) => {
  await orderedPro.map(async (item) => {
    const pro = await Product.findOne({ where: { id: item.ProductId } });
    if (pro.stock == 0) {
      await Product.update(
        { stock: pro.stock + item.quantity, active: true },
        { where: { id: item.ProductId } }
      );
    } else {
      await Product.update(
        { stock: pro.stock + item.quantity },
        { where: { id: item.ProductId } }
      );
    }
  });
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
