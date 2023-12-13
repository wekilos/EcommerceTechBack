var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Market } = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  Market.findAll()
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
  const data = await Market.findOne({ where: { id: id } });
  if (data) {
    res.json(data);
  } else {
    res.send("BU ID boyuncha Parametr yok!");
  }
};

const create = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    valyuta,
    dastavka,
    ex_dastavka,
    phone,
    instagram,
    tiktok,
    telegram,
  } = req.body;

  Market.create({
    name_tm,
    name_ru,
    name_en,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    valyuta,
    dastavka,
    ex_dastavka,
    phone,
    instagram,
    tiktok,
    telegram,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Market:", err);
    });
};

const update = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    description_tm,
    description_ru,
    description_en,
    address_tm,
    address_ru,
    address_en,
    valyuta,
    dastavka,
    ex_dastavka,
    phone,
    instagram,
    tiktok,
    telegram,
    id,
  } = req.body;

  const data = await Market.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Market yok!");
  } else {
    Market.update(
      {
        name_tm,
        name_ru,
        name_en,
        description_tm,
        description_ru,
        description_en,
        address_tm,
        address_ru,
        address_en,
        valyuta,
        dastavka,
        ex_dastavka,
        phone,
        instagram,
        tiktok,
        telegram,
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
        res.json("update Market:", err);
      });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Market.findOne({ where: { id } });
  if (data) {
    Market.destroy({
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
    res.json("Bu Id Boyuncha Market yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
