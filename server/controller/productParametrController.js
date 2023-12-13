var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Parametr,
  Product,
  ProductParametrItem,
  ProductParametr,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted, ProductParametrId } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name_tm: { [Op.iLike]: `%${name}%` } },
            { name_ru: { [Op.iLike]: `%${name}%` } },
            { name_en: { [Op.iLike]: `%${name}%` } },
            { value_tm: { [Op.iLike]: `%${name}%` } },
            { value_ru: { [Op.iLike]: `%${name}%` } },
            { value_en: { [Op.iLike]: `%${name}%` } },
          ],
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
  const ProductParametrID = ProductParametrId
    ? { ProductParametrId: ProductParametrId }
    : null;
  ProductParametrItem.findAll({
    include: [
      {
        model: ProductParametr,
        include: [{ model: Parametr }, { model: Product }],
      },
    ],
    where: {
      [Op.and]: [Title, Active, Deleted, ProductParametrID],
    },
    order: [["orderNum", "ASC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};

const getAllPP = async (req, res) => {
  const { name, active, deleted, ProductId, ParametrId } = req.query;

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
  const ProductID = ProductId ? { ProductId: ProductId } : null;
  const ParametrID = ParametrId ? { ParametrId: ParametrId } : null;
  ProductParametr.findAll({
    include: [
      { model: ProductParametrItem },
      { model: Product },
      { model: Parametr },
    ],
    where: {
      [Op.and]: [Title, Active, Deleted, ProductID, ParametrID],
    },
    order: [["orderNum", "ASC"]],
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
  const data = await ProductParametrItem.findOne({ where: { id: id } });
  if (data) {
    ProductParametrItem.findOne({
      include: [
        {
          model: ProductParametr,
          include: [
            {
              model: Product,
            },
            { model: Product },
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
    res.send("BU ID boyuncha ProductParametr yok!");
  }
};
const getOnePP = async (req, res) => {
  const { id } = req.params;
  const data = await ProductParametr.findOne({ where: { id: id } });
  if (data) {
    ProductParametr.findOne({
      include: [
        {
          model: Product,
        },
        {
          model: ProductParametr,
        },
        {
          model: ProductParametrItem,
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
    res.send("BU ID boyuncha ProductParametr yok!");
  }
};

const create = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    orderNum,
    value_tm,
    value_ru,
    value_en,
    ProductParametrId,
  } = req.body;

  ProductParametrItem.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    value_tm,
    value_ru,
    value_en,
    ProductParametrId,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create ProductParametr:", err);
    });
};
const createPP = async (req, res) => {
  const {
    ParametrId,
    ProductId,
    name_tm,
    name_ru,
    name_en,
    orderNum,
    value_tm,
    value_ru,
    value_en,
  } = req.body;

  const data = await ProductParametr.findOne({
    where: { [Op.and]: [{ ParametrId: ParametrId }, { ProductId: ProductId }] },
  });
  if (data) {
    ProductParametrItem.create({
      name_tm,
      name_ru,
      name_en,
      orderNum,
      value_tm,
      value_ru,
      value_en,
      ProductParametrId: data.id,
    })
      .then(async (data1) => {
        res.json({ data: data, data1 });
      })
      .catch((err) => {
        console.log(err);
        res.json("create ProductParametr:", err);
      });
  } else {
    ProductParametr.create({
      ParametrId,
      ProductId,
    })
      .then(async (data) => {
        ProductParametrItem.create({
          name_tm,
          name_ru,
          name_en,
          orderNum,
          value_tm,
          value_ru,
          value_en,
          ProductParametrId: data.id,
        })
          .then(async (data1) => {
            res.json({ data, data1 });
          })
          .catch((err) => {
            console.log(err);
            res.json("create ProductParametr:", err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json("create ProductParametr:", err);
      });
  }
};

const update = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    orderNum,
    value_tm,
    value_ru,
    value_en,
    ProductParametrId,
    id,
  } = req.body;

  const data = await ProductParametrItem.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha ProductParametr yok!");
  } else {
    ProductParametrItem.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
        value_tm,
        value_ru,
        value_en,
        ProductParametrId,
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
        res.json("update ProductParametr:", err);
      });
  }
};
const updatePP = async (req, res) => {
  const { orderNum, ParametrId, ProductId, id } = req.body;

  const data = await ProductParametr.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha ProductParametr yok!");
  } else {
    ProductParametr.update(
      {
        orderNum,
        ParametrId,
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
        res.json("update ProductParametr:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await ProductParametrItem.findOne({ where: { id } });
  if (data) {
    ProductParametrItem.update({
      deleted: false,
      active: true,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};

const unDeletePP = async (req, res) => {
  const { id } = req.params;
  let data = await ProductParametrItem.findOne({ where: { id } });
  if (data) {
    ProductParametrItem.update({
      deleted: false,
      active: true,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};
const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await ProductParametrItem.findOne({ where: { id } });
  if (data) {
    ProductParametrItem.update({
      deleted: true,
      active: false,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};
const DeletePP = async (req, res) => {
  const { id } = req.params;
  let data = await ProductParametr.findOne({ where: { id } });
  if (data) {
    ProductParametr.update({
      deleted: true,
      active: false,
      where: {
        id,
      },
    })
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await ProductParametrItem.findOne({ where: { id } });
  if (data) {
    ProductParametrItem.destroy({
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
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};
const DestroyPP = async (req, res) => {
  const { id } = req.params;
  const data = await ProductParametr.findOne({ where: { id } });
  if (data) {
    ProductParametr.destroy({
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
    res.json("Bu Id Boyuncha ProductParametr yok!");
  }
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;

exports.getAllPP = getAllPP;
exports.getOnePP = getOnePP;
exports.createPP = createPP;
exports.updatePP = updatePP;
exports.DeletePP = DeletePP;
exports.unDeletePP = unDeletePP;
exports.DestroyPP = DestroyPP;
