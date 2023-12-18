var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { User, Post } = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${name}%` } },
            { lastname: { [Op.iLike]: `%${name}%` } },
            { phone: { [Op.iLike]: `%${name}%` } },
            { text: { [Op.iLike]: `%${name}%` } },
            { email: { [Op.iLike]: `%${name}%` } },
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

  Post.findAll({
    include: [
      {
        model: User,
      },
    ],

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
  const data = await Post.findOne({ where: { id: id } });
  if (data) {
    Post.findOne({
      include: [{ model: User }],
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
    res.send("BU ID boyuncha Post yok!");
  }
};

const create = async (req, res) => {
  const { name, lastname, phone, text, email } = req.body;

  Post.create({
    name,
    lastname,
    phone,
    text,
    email,
    active: true,
    deleted: false,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Post:", err);
    });
};

const update = async (req, res) => {
  const { name, lastname, phone, text, email, id } = req.body;

  const data = await Post.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Parametr yok!");
  } else {
    Post.update(
      {
        name,
        lastname,
        phone,
        text,
        email,
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
        res.json("update Post:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Post.findOne({ where: { id } });
  if (data) {
    Post.destroy({
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
    res.json("Bu Id Boyuncha Post yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
