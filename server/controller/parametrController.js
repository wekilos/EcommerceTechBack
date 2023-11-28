var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Parametr, Product } = require("../../models");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name_tm: { [Op.iLike]: `%${name}%` } },
            { name_ru: { [Op.iLike]: `%${name}%` } },
            { name_en: { [Op.iLike]: `%${name}%` } },
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

  Parametr.findAll({
    // include: [
    //   {
    //     model: Product,
    //   },
    // ],

    where: {
      [Op.and]: [Title, Active, Deleted],
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
  const data = await Parametr.findOne({ where: { id: id } });
  if (data) {
    Parametr.findOne({
      include: [{ model: Product }],
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
    res.send("BU ID boyuncha Parametr yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum } = req.body;

  Parametr.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    active: true,
    deleted: false,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Parametr:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, id } = req.body;

  const data = await Parametr.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Parametr yok!");
  } else {
    Parametr.update(
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
        res.json("update Parametr:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Parametr.findOne({ where: { id } });
  if (data) {
    Parametr.update({
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
    res.json("Bu Id Boyuncha Parametr yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Parametr.findOne({ where: { id } });
  if (data) {
    Parametr.update({
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
    res.json("Bu Id Boyuncha Parametr yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Parametr.findOne({ where: { id } });
  if (data) {
    Parametr.destroy({
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
    res.json("Bu Id Boyuncha Parametr yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
