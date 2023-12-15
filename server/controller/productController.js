var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Category,
  Product,
  Brand,
  ProductImg,
  ProductVideo,
  ProductParametr,
  ProductParametrItem,
  Parametr,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const {
    name,
    active,
    deleted,
    CategoryId,
    CategoryIds,
    BrandId,
    BrandIds,
    is_discount,
    is_moresale,
    is_valyuta,
    is_new,
    is_selected,
    order,
    startPrice,
    endPrice,
    limit,
    page,
  } = req.query;

  const Page = page ? page : 0;
  const Limit = limit ? limit : 10;
  const Ofset = Page * Limit;
  const CategoryIdS =
    CategoryIds &&
    CategoryIds?.filter((item) => {
      return item != "0";
    });
  console.log("====>>>>>>>>>>>>>>>>", CategoryIds, CategoryIdS, name);
  const CategoryIDs =
    CategoryIdS && CategoryIdS.length > 0
      ? { CategoryId: { [Op.in]: CategoryIdS } }
      : null;
  const BrandIDs =
    BrandIds && BrandIds.length > 0 ? { BrandId: { [Op.in]: BrandIds } } : null;
  const Title =
    name?.length > 0
      ? {
          [Op.or]: [
            { name_tm: { [Op.iLike]: `%${name}%` } },
            { name_ru: { [Op.iLike]: `%${name}%` } },
            { name_en: { [Op.iLike]: `%${name}%` } },
            { color_tm: { [Op.iLike]: `%${name}%` } },
            { color_ru: { [Op.iLike]: `%${name}%` } },
            { color_en: { [Op.iLike]: `%${name}%` } },
            { description_tm: { [Op.iLike]: `%${name}%` } },
            { description_ru: { [Op.iLike]: `%${name}%` } },
            { description_en: { [Op.iLike]: `%${name}%` } },
            { bar_code: { [Op.iLike]: `%${name}%` } },
          ],
        }
      : null;

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

  const CategoryID =
    CategoryId &&
    (CategoryId
      ? {
          CategoryId: CategoryId,
        }
      : null);

  const BrandID =
    BrandId &&
    (BrandId
      ? {
          BrandId: BrandId,
        }
      : null);
  const Is_discount =
    is_discount &&
    (is_discount != ""
      ? {
          is_discount: is_discount,
        }
      : null);

  const Is_moresale =
    is_moresale &&
    (is_moresale != ""
      ? {
          is_moresale: is_moresale,
        }
      : null);

  const Is_Valyuta =
    is_valyuta &&
    (is_valyuta != ""
      ? {
          is_valyuta: is_valyuta,
        }
      : null);

  const Is_New =
    is_new &&
    (is_new != ""
      ? {
          is_new: is_new,
        }
      : null);

  const Is_Selected =
    is_selected &&
    (is_selected != ""
      ? {
          is_selected: is_selected,
        }
      : null);
  const Order =
    order == 2
      ? ["price", "DESC"]
      : order == 1
      ? ["price", "ASC"]
      : order == 3
      ? ["name_tm", "ASC"]
      : order == 4
      ? ["name_tm", "DESC"]
      : ["orderNum", "ASC"];
  const StartPrice = startPrice
    ? {
        price: { [Op.gte]: startPrice },
      }
    : null;

  const EndPrice = endPrice
    ? {
        price: { [Op.lte]: endPrice },
      }
    : null;

  Product.findAll({
    include: [
      {
        model: ProductImg,
      },
      {
        model: ProductVideo,
      },
      {
        model: Category,
      },
      {
        model: Brand,
      },
      {
        model: ProductParametr,
        include: [
          {
            model: Parametr,
          },
          {
            model: ProductParametrItem,
          },
        ],
      },
    ],
    where: {
      [Op.and]: [
        Title,
        Active,
        Deleted,
        CategoryID,
        BrandID,
        Is_discount,
        Is_moresale,
        Is_Valyuta,
        Is_New,
        Is_Selected,
        StartPrice,
        EndPrice,
        CategoryIDs,
        BrandIDs,
      ],
    },
    order: [Order],
    offset: Ofset,
    limit: Limit,
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
  let data;
  if (id) {
    data = await Product.findOne({ where: { id: id } });
  } else {
    data = null;
  }
  if (data) {
    Product.findOne({
      include: [
        {
          model: Category,
        },

        {
          model: Brand,
        },
        {
          model: ProductImg,
        },
        { model: ProductVideo },
        {
          model: ProductParametr,
          include: [
            {
              model: Parametr,
            },
            {
              model: ProductParametrItem,
            },
          ],
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
    res.send("BU ID boyuncha Product yok!");
  }
};

const create = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    color_tm,
    color_ru,
    color_en,
    description_ru,
    description_tm,
    description_en,
    bar_code,
    price,
    discount_price,
    is_discount,
    usd_price,
    usd_price_discount,
    is_valyuta,
    discount,
    stock,
    is_moresale,
    is_new,
    is_selected,
    link,
    orderNum,
    CategoryId,
    BrandId,
  } = req.body;

  const files =
    req.files?.img &&
    (req.files.img.constructor === Array ? req.files.img : [req.files.img]);

  const fvideos =
    req.files?.video &&
    (req.files.video.constructor === Array
      ? req.files.video
      : [req.files.video]);

  let imgs = [];
  let videos = [];
  const upl = (img, id) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/product/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id, img: img.name });
  };
  const uplv = (img, id) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/product/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    videos.push({ src: img_direction, ProductId: id, file_name: img.name });
  };

  Product.create({
    name_tm,
    name_ru,
    name_en,
    color_tm,
    color_ru,
    color_en,
    description_ru,
    description_tm,
    description_en,
    bar_code,
    price,
    discount_price,
    is_discount,
    usd_price: price,
    usd_price_discount: discount_price,
    is_valyuta,
    discount,
    stock,
    is_moresale,
    is_new,
    is_selected,
    link,
    orderNum,
    CategoryId,
    BrandId,
  })
    .then(async (data) => {
      // res.json(data);
      await files?.map((item) => {
        upl(item, data.id);
      });
      await fvideos?.map((item) => {
        uplv(item, data.id);
      });
      let pro = data;
      const cvideos = await ProductVideo.bulkCreate(videos, {
        returning: true,
      });
      await ProductImg.bulkCreate(imgs, { returning: true })
        .then(async (data) => {
          res.json({ pro, data, cvideos });
        })
        .catch((err) => {
          console.log(err);
          res.json("create ProductImg:", err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json("create Product:", err);
    });
};

const update = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    color_tm,
    color_ru,
    color_en,
    description_ru,
    description_tm,
    description_en,
    bar_code,
    price,
    discount_price,
    is_discount,
    usd_price,
    usd_price_discount,
    is_valyuta,
    discount,
    stock,
    is_moresale,
    is_new,
    is_selected,
    link,
    orderNum,
    CategoryId,
    BrandId,
    id,
  } = req.body;

  const data = await Product.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Product yok!");
  } else {
    Product.update(
      {
        name_tm,
        name_ru,
        name_en,
        color_tm,
        color_ru,
        color_en,
        description_ru,
        description_tm,
        description_en,
        bar_code,
        price,
        discount_price,
        is_discount,
        usd_price: price,
        usd_price_discount: discount_price,
        is_valyuta,
        discount,
        stock,
        is_moresale,
        is_new,
        is_selected,
        link,
        orderNum,
        CategoryId,
        BrandId,
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
        res.json("update Product:", err);
      });
  }
};

const deleteProductImg = async (req, res) => {
  const { id } = req.params;

  const data = await ProductImg.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boyuncha Product IMG yok!!!");
  } else {
    await fs.unlink(data.src, (err) => {
      console.log(err);
    });
    ProductImg.destroy({ where: { id: id } })
      .then((data) => {
        res.json("DEleted IMG");
      })
      .catch((err) => {
        res.json(data);
      });
  }
};

const uploadsImg = async (req, res) => {
  const { id } = req.params;
  const files =
    req.files.img.constructor === Array ? req.files.img : [req.files.img];
  console.log("filessss>>>>>>", typeof files);
  console.log("files", files);

  let imgs = [];
  const upl = (img) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/product/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id, file_name: img.name });
  };

  files?.map((item) => {
    upl(item);
  });

  ProductImg.bulkCreate(imgs, { returning: true })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create ProductImg:", err);
    });
};

const uploadsVideo = async (req, res) => {
  const { id } = req.params;
  const files =
    req.files.img.constructor === Array ? req.files.img : [req.files.img];
  console.log("filessss>>>>>>", typeof files);
  console.log("files", files);

  let imgs = [];
  const upl = (img) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/product/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id });
  };

  files?.map((item) => {
    upl(item);
  });

  ProductVideo.bulkCreate(imgs, { returning: true })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create ProductVideo:", err);
    });
};

const deleteProductVideo = async (req, res) => {
  const { id } = req.params;

  const data = await ProductVideo.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boyuncha Product Video yok!!!");
  } else {
    await fs.unlink(data.src, (err) => {
      console.log(err);
    });
    ProductVideo.destroy({ where: { id: id } })
      .then((data) => {
        res.json("Deleted Video");
      })
      .catch((err) => {
        res.json(data);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Product.findOne({ where: { id } });
  if (data) {
    Product.update(
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
    res.json("Bu Id Boyuncha Product yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Product.findOne({ where: { id } });
  if (data) {
    Product.update(
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
    res.json("Bu Id Boyuncha Product yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Product.findOne({ where: { id } });
  if (data) {
    fs.unlink(data?.img, function (err) {
      console.log(err);
    });
    Product.destroy({
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
    res.json("Bu Id Boyuncha Product yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
exports.uploadsImg = uploadsImg;
exports.deleteProductImg = deleteProductImg;
exports.uploadsVideo = uploadsVideo;
exports.deleteProductVideo = deleteProductVideo;
