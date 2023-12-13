var Sequelize = require("sequelize");
const {
  FavProduct,
  User,
  Product,
  ProductImg,
  ProductVideo,
  ProductParametr,
  ProductParametrItem,
  Parametr,
} = require("../../models/index.js");
const Op = Sequelize.Op;
const fs = require("fs");

const getAll = async (req, res) => {
  const { type, UserId } = req.query;
  FavProduct.findAll({
    include: [
      { model: User },
      {
        model: Product,
        include: [
          { model: ProductImg },
          { model: ProductVideo },
          {
            model: ProductParametr,
            include: [
              {
                model: Parametr,
              },
              {
                model: ProductParametrItem,
              },
            ],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
    where: { UserId: UserId },
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
  const data = await FavProduct.findOne({ where: { id: id } });
  if (data) {
    FavProduct.findOne({
      include: [
        { model: User },
        {
          model: Product,
          include: [
            { model: ProductImg },
            { model: ProductVideo },
            {
              model: ProductParametr,
              include: [
                {
                  model: Parametr,
                },
                {
                  model: ProductParametrItem,
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.send("BU ID boyuncha FavProduct yok!");
  }
};

const create = async (req, res) => {
  const { UserId, ProductId } = req.body;
  const favPro = await FavProduct.findOne({
    where: { [Op.and]: [{ UserId: UserId }, { ProductId: ProductId }] },
  });
  if (favPro) {
  } else {
    FavProduct.create({ UserId, ProductId })
      .then(async (data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json("create FavProduct:", err);
      });
  }
};

const update = async (req, res) => {
  const { id, UserId, ProductId } = req.body;

  const data = await FavProduct.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha FavProduct yok!");
  } else {
    FavProduct.update(
      {
        UserId,
        ProductId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async (data) => {
        res.json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update FavProduct:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await FavProduct.findOne({ where: { id } });
  if (data) {
    FavProduct.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.json("destroyed!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha FavProduct yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
