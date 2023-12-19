var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Privacy } = require("../../models/index.js");

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

  Privacy.findAll({
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
  const data = await Privacy.findOne({ where: { id: id } });
  if (data) {
    Privacy.findOne({
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
    res.send("BU ID boyuncha Privacy yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, text_tm, text_ru, text_en } = req.body;

  Privacy.create({
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
      res.json("create Privacy:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, text_tm, text_ru, text_en, id } = req.body;

  const data = await Privacy.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Privacy yok!");
  } else {
    Privacy.update(
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
        res.json("update Privacy:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Privacy.findOne({ where: { id } });
  if (data) {
    Privacy.destroy({
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
    res.json("Bu Id Boyuncha Privacy yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
