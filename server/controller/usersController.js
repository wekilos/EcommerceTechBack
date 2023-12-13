var Sequelize = require("sequelize");
const {
  User,
  UserAddress,
  UserVerification,
} = require("../../models/index.js");
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
  User.findAll({
    include: [
      {
        model: UserAddress,
      },
    ],

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
  const data = await User.findOne({ where: { id: id } });
  if (data) {
    User.findOne({
      include: [
        {
          model: UserAddress,
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
    res.send("BU ID boýunça Ulanyjy ýok!");
  }
};

const create = async (req, res) => {
  const { name, lastname, address, password, phone, code } = req.body;
  const exist = await User.findOne({
    where: {
      phone: phone,
    },
  });

  const verification = await UserVerification.findOne({
    where: { phonenumber: phone },
  });
  if (!verification) {
    res.json({ login: false, msg: "Telefon belgiňiz nädogry!" });
  } else if (verification.code != code) {
    res.json({ login: false, msg: "Siziň tassyklaýyş kodyňyz nädogry!" });
  } else if (exist) {
    let text = "Bu nomur-da ulanyjy bar!";
    res.json({
      login: false,
      msg: text,
    });
  } else {
    const salt = bcrypt.genSaltSync();
    bcrypt.hash(password, salt, (err, hashpassword) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error", err: err });
      } else {
        User.create({
          name,
          lastname,
          address,
          password: hashpassword,
          phone,
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
            res.json("create user:", err);
          });
      }
    });
  }
};

const create2 = async (req, res) => {
  const { name, lastname, address, password, phone } = req.body;
  const exist = await User.findOne({
    where: {
      phone: phone,
    },
  });
  if (exist) {
    let text = "Bu nomur-da ulanyjy bar!";
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
        User.create({
          name,
          lastname,
          address,
          password: hashpassword,
          phone,
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
            res.json("create user:", err);
          });
      }
    });
  }
};

const login2 = async (req, res) => {
  const { phone, password } = req.body;

  const code = Math.floor(Math.random() * 90000) + 10000;
  await User.findOne({
    where: { phone: phone },
  })
    .then(async (data) => {
      if (!data.active) {
        res.json({ msg: "Siz DisActive edilen!" });
        return 0;
      } else {
        await UserVerification.destroy({
          where: { phone: phone },
        });
        UserVerification.create({
          phone: phone,
          code: code,
          send: false,
        })
          .then(async (data) => {
            axios
              .post(BASE_URL + "/send-code", {
                code: "Siziň tassyklaýyş kodyňyz: " + code,
                phone: "+" + phone,
              })
              .then((data) => {
                res.json("send code!");
              })
              .catch((err) => {
                res.json("post err" + err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.json("create verification err" + err);
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

  await User.findOne({
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
  const { name, lastname, address, password, id } = req.body;

  const data = await User.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boýunça Ulanyjy ýok!");
  } else {
    if (password) {
      const salt = bcrypt.genSaltSync();
      bcrypt.hash(password, salt, (err, hashpassword) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: "Error", err: err });
        } else {
          User.update(
            {
              name,
              lastname,
              address,
              password: hashpassword,
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
              res.json("update ulanyjy:", err);
            });
        }
      });
    } else {
      User.update(
        {
          name,
          lastname,
          address,
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
          res.json("update ulanyjy:", err);
        });
    }
  }
};

const disActive = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
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
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const Active = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
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
        res.json("DisActived!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.update(
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
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};
const Destroy = async (req, res) => {
  const { id } = req.params;
  let data = await User.findOne({ where: { id } });
  if (data) {
    User.destroy({
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
    res.json("BU ID boýunça Ulanyjy ýok!");
  }
};

const sendCode = async (req, res) => {
  const { phone, code } = req.body;
  await UserVerification.destroy({
    where: { phonenumber: phone },
  });

  const Code = code ? code : Math.floor(Math.random() * 90000) + 10000;
  UserVerification.create({
    phonenumber: phone,
    code: Code,
  })
    .then(async (data) => {
      await axios
        .post(BASE_URL + "/send-code", {
          code: "Siziň tassyklaýyş kodyňyz: " + Code,
          phone: "+" + phone,
        })
        .then((data) => {
          res.json("send code!");
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json("create verification err" + err);
    });
};
const checkCode = async (req, res) => {
  const { code, phone } = req.body;

  const verification = await UserVerification.findOne({
    where: { phonenumber: phone },
  });
  if (!verification) {
    res.json("Telefon belgiňiz nädogry!");
  } else {
    if (verification.code != code) {
      res.json("Siziň tassyklaýyş kodyňyz nädogry!");
    }
    User.findOne({ where: { phone: phone } }).then((data) => {
      if (!data) {
        res.json("Telefon belgiňiz nädogry!");
      } else {
        jwt.sign(
          {
            id: data.id,
            name: data.name + " " + data.lastname,
            phone: data.phone,
          },
          Func.Secret(),
          (err, token) => {
            res.status(200).json({
              msg: "Suссessfully",
              token: token,
              id: data.id,
              name: data.name + " " + data.lastname,
              phone: data.phone,
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
exports.create2 = create2;
exports.login = login;
exports.update = update;
exports.disActive = disActive;
exports.Active = Active;
exports.Delete = Delete;
exports.Destroy = Destroy;
exports.checkCode = checkCode;
exports.sendCode = sendCode;
