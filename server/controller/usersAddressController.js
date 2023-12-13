var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { User, UserAddress } = require("../../models/index.js");
var sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");

const fs = require("fs");

const getAll = async (req, res) => {
  const { UserId, title } = req.query;

  const Title =
    title &&
    (title?.length > 0
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${title}%` } },
            { address: { [Op.like]: `%${title}%` } },
          ],
        }
      : null);

  UserAddress.findAll({
    include: [
      {
        model: User,
      },
    ],

    where: {
      [Op.and]: [Title, { UserId: UserId }],
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
  const data = await UserAddress.findOne({ where: { id: id } });
  if (data) {
    UserAddress.findOne({
      include: [
        {
          model: User,
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
    res.send("BU ID boyuncha UserAddress yok!");
  }
};

const create = async (req, res) => {
  const { title, address, UserId } = req.body;

  UserAddress.create({
    title,
    address,
    UserId,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create UserAddress:", err);
    });
};

const update = async (req, res) => {
  const { title, address, id } = req.body;

  const data = await UserAddress.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha UserAddress yok!");
  } else {
    UserAddress.update(
      {
        title,
        address,
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
        res.json("update userAddress:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await UserAddress.findOne({ where: { id } });
  if (data) {
    UserAddress.destroy({
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
    res.json("Bu Id Boyuncha UserAddress yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
