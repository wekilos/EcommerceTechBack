var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Category, Product } = require("../../models");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted, is_favorite } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            {
              name_tm: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_tm")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_ru: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_ru")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_en: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_en")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
          ],
        }
      : null);

  const Favorite =
    is_favorite &&
    (is_favorite
      ? {
          is_favorite: is_favorite,
        }
      : { is_favorite: false });

  const Active = active
    ? {
        active: active,
      }
    : {
        active: true,
      };
  const Deleted = deleted
    ? {
        deleted: deleted,
      }
    : {
        deleted: false,
      };

  Category.findAll({
    include: [
      {
        model: Product,
      },
    ],

    where: {
      [Op.and]: [Title, Active, Deleted, Favorite],
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
  const data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.findOne({
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
    res.send("BU ID boyuncha Category yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, is_favorite, orderNum } = req.body;

  const files = req?.files?.img;

  let randomNumber = Math.floor(Math.random() * 999999999999);
  let img_direction = `./uploads/category/` + randomNumber + `${files.name}`;
  fs.writeFile(img_direction, files.data, function (err) {
    console.log(err);
  });

  Category.create({
    name_tm,
    name_ru,
    name_en,
    orderNum,
    img: img_direction,
    is_favorite,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Category:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, is_favorite, id } = req.body;
  const files = req?.files?.img;

  const data = await Category.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Category yok!");
  } else {
    let img_direction = data?.img;
    if (files) {
      fs.unlink(data?.img, function (err) {
        console.log(err);
      });
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/category/` + randomNumber + `${files.name}`;
      fs.writeFile(img_direction, files.data, function (err) {
        console.log(err);
      });
    } else {
    }

    Category.update(
      {
        name_tm,
        name_ru,
        name_en,
        orderNum,
        img: img_direction,
        is_favorite,
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
        res.json("update Category:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.update(
      {
        deleted: false,
        active: true,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Category yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.update(
      {
        deleted: true,
        active: false,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Category yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Category.findOne({ where: { id: id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    Category.destroy({
      where: {
        id: id,
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
    res.json("Bu Id Boyuncha Category yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
