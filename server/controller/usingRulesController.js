var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { UsingRule } = require("../../models/index.js");

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
            { text_tm: { [Op.iLike]: `%${name}%` } },
            { text_ru: { [Op.iLike]: `%${name}%` } },
            { text_en: { [Op.iLike]: `%${name}%` } },
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

  UsingRule.findAll({
    where: {
      [Op.and]: [Title, Active, Deleted],
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
  const data = await UsingRule.findOne({ where: { id: id } });
  if (data) {
    UsingRule.findOne({
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
    res.send("BU ID boyuncha UsingRule yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, text_tm, text_ru, text_en } = req.body;

  UsingRule.create({
    name_tm,
    name_ru,
    name_en,
    text_tm,
    text_ru,
    text_en,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create UsingRule:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, text_tm, text_ru, text_en, id } = req.body;

  const data = await UsingRule.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha UsingRule yok!");
  } else {
    UsingRule.update(
      {
        name_tm,
        name_ru,
        name_en,
        text_tm,
        text_ru,
        text_en,
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
        res.json("update UsingRule:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await UsingRule.findOne({ where: { id } });
  if (data) {
    UsingRule.destroy({
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
    res.json("Bu Id Boyuncha UsingRule yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
