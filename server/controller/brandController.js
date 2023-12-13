var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Brand, Product } = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const { name, active, deleted, is_favorite } = req.query;

  const Favorite =
    is_favorite &&
    (is_favorite
      ? {
          is_favorite: is_favorite,
        }
      : { is_favorite: false });
  const Title =
    name?.length > 0
      ? {
          [Op.or]: [
            { name_tm: { [Op.iLike]: `%${name}%` } },
            { name_ru: { [Op.iLike]: `%${name}%` } },
            { name_en: { [Op.iLike]: `%${name}%` } },
          ],
        }
      : null;
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
  Brand.findAll({
    include: [{ model: Product }],
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
  const data = await Brand.findOne({ where: { id: id } });
  if (data) {
    Brand.findOne({
      include: [
        {
          model: Product,
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
    res.send("BU ID boyuncha Brand yok!");
  }
};

const create = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, is_favorite } = req.body;

  const files = req?.files?.img;

  let randomNumber = Math.floor(Math.random() * 999999999999);
  let img_direction = `./uploads/brand/` + randomNumber + `${files.name}`;
  fs.writeFile(img_direction, files.data, function (err) {
    console.log(err);
  });

  Brand.create({
    name_tm,
    name_ru,
    name_en,
    is_favorite,
    img: img_direction,
    orderNum,
  })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create Brand:", err);
    });
};

const update = async (req, res) => {
  const { name_tm, name_ru, name_en, orderNum, is_favorite, id } = req.body;
  const files = req?.files?.img;

  const data = await Brand.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Brand yok!");
  } else {
    let img_direction = data?.img;
    if (files) {
      fs.unlink(data?.img, function (err) {
        console.log(err);
      });
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/brand/` + randomNumber + `${files.name}`;
      fs.writeFile(img_direction, files.data, function (err) {
        console.log(err);
      });
    } else {
    }

    Brand.update(
      {
        name_tm,
        name_ru,
        name_en,
        is_favorite,
        orderNum,
        img: img_direction,
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
        res.json("update Brand:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Brand.findOne({ where: { id } });
  if (data) {
    Brand.update(
      {
        deleted: false,
        active: true,
      },
      {
        where: {
          id,
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
    res.json("Bu Id Boyuncha Brand yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Brand.findOne({ where: { id } });
  if (data) {
    Brand.update(
      {
        deleted: true,
        active: false,
      },
      {
        where: {
          id,
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
    res.json("Bu Id Boyuncha Brand yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Brand.findOne({ where: { id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    Brand.destroy({
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
    res.json("Bu Id Boyuncha Brand yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
