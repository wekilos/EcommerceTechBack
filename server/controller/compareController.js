var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  ComparePro,
  Compare,
  Category,
  Product,
  Brand,
  ProductImg,
  ProductVideo,
  ProductParametr,
  ProductParametrItem,
  Parametr,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  await Compare.findAll({
    include: [
      {
        model: ComparePro,
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
      },
    ],
  })
    .then((data) => {
      console.log("comparree >>>>>>>>>>>", data.data);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};

const getAllByPro = async (req, res) => {
  const { ProductId } = req.params;
  const compro = await ComparePro.findOne({ where: ProductId });

  if (compro) {
    await Compare.findAll({
      include: [
        {
          model: ComparePro,
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
                  model: ProductParametr,
                  include: [
                    {
                      model: Parametr,
                    },
                    {
                      model: ProductParametrItem,
                      // attributes: [
                      //   "id",
                      //   "name_tm",
                      //   "name_ru",
                      //   "name_en",
                      //   "value_tm",
                      //   "value_ru",
                      //   "value_en",
                      // ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: compro?.CompareId,
      },
    })
      .then((data) => {
        console.log("comparree >>>>>>>>>>>", data.data);
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.json([]);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const data = await Compare.findOne({
    include: [
      {
        model: ComparePro,
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
      },
    ],
    where: { id: id },
  });
  if (data) {
    res.json(data);
  } else {
    res.send("BU ID boyuncha Parametr yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum } = req.body;

  Compare.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Compare:", err);
    });
};

const addPro = async (req, res) => {
  const { ProductId, CompareId } = req.body;

  const data = await Compare.findOne({ where: { id: CompareId } });
  const data2 = await Product.findOne({ where: { id: ProductId } });
  if (!data || !data2) {
    res.json("Bu Id boyuncha Compare yok!");
  } else {
    ComparePro.create({
      ProductId,
      CompareId,
    })
      .then(async (data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json("update Compare:", err);
      });
  }
};
const removePro = async (req, res) => {
  const { id } = req.params;
  const data = await ComparePro.findOne({ where: { id } });
  if (data) {
    ComparePro.destroy({
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
    res.json("Bu Id Boyuncha ComparePro yok!");
  }
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, id } = req.body;

  const data = await Compare.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Compare yok!");
  } else {
    Compare.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
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
        res.json("update Compare:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Compare.findOne({ where: { id } });
  if (data) {
    Compare.destroy({
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
    res.json("Bu Id Boyuncha Compare yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
exports.addPro = addPro;
exports.removePro = removePro;
exports.getAllByPro = getAllByPro;
