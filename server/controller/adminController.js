var Sequelize = require("sequelize");
const { Admin, UserVerification } = require("../../models");
var sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");
const Op = Sequelize.Op;
const fs = require("fs");

const axios = require("axios");

const BASE_URL = "http://localhost:6415";

const getAll = async (req, res) => {
  const { active, deleted, name } = req.query;

  const Active = active ? { active: active } : { active: true };
  const Deleted = deleted ? { deleted: deleted } : { deleted: false };
  const Username =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${name}%` } },
            { lastname: { [Op.like]: `%${name}%` } },
          ],
        }
      : null);
  Admin.findAll({
    where: {
      [Op.and]: [Active, Deleted, Username],
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
  const data = await Admin.findOne({ where: { id: id } });
  if (data) {
    Admin.findOne({
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
    res.send("BU ID boyuncha Admin yok!");
  }
};

const create = async (req, res) => {
  const { name, lastname, phone, password } = req.body;
  const exist = await Admin.findOne({
    where: {
      phone: phone,
    },
  });

  if (exist) {
    let text = "Bu nomur-da Admin hasaba alynan Login ediň!";
    res.json({
      msg: text,
    });
  } else {
    const salt = bcrypt.genSaltSync();
    bcrypt.hash(password, salt, (err, hashpassword) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error", err: err });
      } else {
        Admin.create({
          name,
          lastname,
          phone,
          password: hashpassword,
          active: true,
          deleted: false,
        })
          .then(async (data) => {
            const token = jwt.sign(
              {
                id: data.id,
                name: data.name,
                phone: data.phone,
              },
              Func.Secret()
            );

            return res.json({
              id: data.id,
              name: data.name,
              token: token,
              login: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.json("create Admin:", err);
          });
      }
    });
  }
};

const login2 = async (req, res) => {
  const { phone } = req.body;

  const code = Math.floor(Math.random() * 90000) + 10000;
  await Admin.findOne({
    where: { phone: phone },
  })
    .then(async (data) => {
      if (!data.active) {
        res.json({ login: false, msg: "Siz DisActive edilen!" });
        return 0;
      } else {
        await UserVerification.destroy({
          where: { phonenumber: phone },
        });
        UserVerification.create({
          phonenumber: phone,
          code: code,
          send: false,
        })
          .then(async (data) => {
            axios
              .post(BASE_URL + "/send-code", {
                code: "Siziň tassyklaýyş kodyňyz: " + code,
                phonenumber: "+" + phone,
              })
              .then((data) => {
                res.json({
                  login: true,
                  msg: "Siziň belgiňize tassyklaýyş kody ugradyldy!",
                });
              })
              .catch((err) => {
                res.json({ login: false, msg: "Gaýtadan barlaň!", err: err });
              });
          })
          .catch((err) => {
            console.log(err);
            res.json({ login: false, msg: "Gaýtadan barlaň!", err: err });
          });
      }
    })
    .catch((err) => {
      let text = "Hasaba alynmadyk Ulanyjy!";
      res.send({ login: false, msg: text, err: err });
    });
};
const login = async (req, res) => {
  console.log("Login data =" + JSON.stringify(req.body));

  const { lang, phone, password } = req.body;

  await Admin.findOne({
    where: { phone: phone },
  })
    .then(async (data) => {
      if (await bcrypt.compare(password, data.password)) {
        const token = jwt.sign(
          {
            id: data.id,
            name: data.name,
            phone: data.phone,
          },
          Func.Secret()
        );

        return res.json({
          id: data.id,
          name: data.name,
          token: token,
          login: true,
        });
      } else {
        let text = "Siziň ulanyjy adyňyz ýa-da açar sözüňiz nädogry!";
        if (lang == "ru") {
          text = "Ваше имя пользователя или пароль недействительны!";
        } else if (lang == "en") {
          text = "Your username or password is invalid!";
        }
        res.send({
          msg: text,
          login: false,
        });
      }
    })
    .catch((err) => {
      let text = "Hasaba alynmadyk ulanyjy!";
      if (lang == "ru") {
        text = "Незарегистрированный пользователь!";
      } else if (lang == "en") {
        text = "Unregistered user!";
      }
      res.send({ login: false, msg: text, err: err });
    });
};
const update = async (req, res) => {
  const { name, lastname, password, id } = req.body;

  const data = await Admin.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boýunça Admin ýok!");
  } else {
    if (password) {
      const salt = await bcrypt.genSaltSync();
      bcrypt.hash(password, salt, (err, hashpassword) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: "Error", err: err });
        } else {
          Admin.update(
            {
              name,
              lastname,
              password: password != null && hashpassword,
              active: true,
              deleted: false,
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
              res.json("update admin:", err);
            });
        }
      });
    } else {
      Admin.update(
        {
          name,
          lastname,
          active: true,
          deleted: false,
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
          res.json("update admin:", err);
        });
    }
  }
};

const disActive = async (req, res) => {
  const { id } = req.params;
  let data = await Admin.findOne({ where: { id } });
  if (data) {
    Admin.update(
      {
        active: false,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("DisActived!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boýunça Admin ýok!");
  }
};

const Active = async (req, res) => {
  const { id } = req.params;
  let data = await Admin.findOne({ where: { id } });
  if (data) {
    Admin.update(
      {
        active: true,
        deleted: false,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("Actived!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boýunça Admin ýok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Admin.findOne({ where: { id } });
  if (data) {
    Admin.update(
      {
        active: false,
        deleted: true,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("Deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boýunça Admin ýok!");
  }
};
const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await Admin.findOne({ where: { id } });
  if (data) {
    Admin.destroy({
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
    res.json("Bu Id Boýunça Admin ýok!");
  }
};

const checkCode = async (req, res) => {
  const { code, phone } = req.body;

  const verification = await UserVerification.findOne({
    where: { phonenumber: phone },
  });
  if (!verification) {
    res.json({ login: false, msg: "Telefon belgiňiz nädogry!" });
  } else {
    if (verification.code != code) {
      res.json({ login: false, msg: "Tassyklaýyş kodyňyz nädogry!" });
    }
    Admin.findOne({ where: { phone: phone } }).then((data) => {
      if (!data) {
        res.json({ login: false, msg: "Telefon belgiňiz nädogry!" });
      } else {
        jwt.sign(
          {
            id: data.id,
            name: data.name + " " + data.lastname,
            phone: data.phone,
            admin: true,
            type: 1,
          },
          Func.Secret(),
          (err, token) => {
            res.status(200).json({
              msg: "Siz ulgama girdiňiz!",
              login: true,
              token: token,
              id: data.id,
              name: data.name + " " + data.lastname,
              phone: data.phone,
              type: 1,
            });
          }
        );
      }
    });
  }
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.login = login;
exports.update = update;
exports.disActive = disActive;
exports.Active = Active;
exports.Delete = Delete;
exports.Destroy = Destroy;
exports.checkCode = checkCode;
