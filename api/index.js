import { Router } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import Datastore from "nedb";
import adminPassword from "../private/adminPassword";

const db = {};
db.reviews = new Datastore({ filename: "db/reviews.db", autoload: true });
db.articles = new Datastore({ filename: "db/articles.db", autoload: true });
db.questions = new Datastore({ filename: "db/questions.db", autoload: true });
db.services = new Datastore({ filename: "db/services.db", autoload: true });

const storage = multer.diskStorage({
  destination: "/var/www/www-root/data/simple-api/public/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Buffer.from(file.originalname, 'latin1').toString());
  },
});

const upload = multer({ storage: storage });

export default Router()
  .get("/reviews", (req, res) => {
    const reviews = db.reviews.getAllData();
    res.status(200).json(reviews);
  })

  .post("/reviews/new", (req, res) => {
    const body = req.body;
    const newReview = {
      ...body,
      date: new Date().toISOString(),
    };
    db.reviews.insert(newReview, (err, review) => {
      res.status(200).json(review);
    });
  })

  .delete("/reviews/delete/:reviewId", (req, res) => {
    const reviewId = req.params?.reviewId;
    db.reviews.remove({ _id: reviewId });
    res.status(200).json(reviewId);
  })

  .put("/reviews/update/:reviewId", (req, res) => {
    const reviewId = req.params?.reviewId;
    const body = req.body;
    db.reviews.update({ _id: reviewId }, body);
    db.reviews.findOne({ _id: reviewId }, {}, (err, review) => {
      res.status(200).json(review);
    });
  })

  .get("/articles", (req, res) => {
    const articles = db.articles.getAllData();
    res.status(200).json(articles);
  })

  .post("/articles/new", upload.single("img"), (req, res) => {
    const body = req.body;
    const newArticle = {
      ...body,
      date: new Date().toISOString(),
      img: "https://podrostok-syktyvkar.ru/public/" + req.file.filename,
    };
    db.articles.insert(newArticle, (err, article) => {
      res.status(200).json(article);
    });
  })

  .delete("/articles/delete/:articleId", (req, res) => {
    const articleId = req.params?.articleId;
    db.articles.remove({ _id: articleId });
    res.status(200).json(articleId);
  })

  .put("/articles/update/:articleId", upload.single("img"), (req, res) => {
    const articleId = req.params?.articleId;
    const body = req.body;
    const updatedArticle = {
      ...body,
      img: req.file
        ? "https://podrostok-syktyvkar.ru/public/" + req.file.filename
        : body.img,
    };
    db.articles.update({ _id: articleId }, updatedArticle);
    db.articles.findOne({ _id: articleId }, {}, (err, article) => {
      res.status(200).json(article);
    });
  })

  .get("/questions", (req, res) => {
    const questions = db.questions.getAllData();
    res.status(200).json(questions);
  })

   .post("/questions/new", upload.single("file"), (req, res) => {
    const body = req.body;
    const newQuestion = {
      ...body,
      file: "https://podrostok-syktyvkar.ru/api/download/" + req.file.filename,
    }
     console.warn(newQuestion)
    db.questions.insert(newQuestion, (err, question) => {
      console.warn(question)
      res.status(200).json(question);
    });
  })

  .delete("/questions/delete/:questionId", (req, res) => {
    const questionId = req.params?.questionId;
    db.questions.remove({ _id: questionId });
    res.status(200).json(questionId);
  })

  ..put("/questions/update/:questionId", upload.single("file"), (req, res) => {
    const questionId = req.params?.questionId;
    const body = req.body;
    const updatedQuestion = {
      ...body,
      file: req.file
        ? "https://podrostok-syktyvkar.ru/api/download/" + req.file.filename
        : body.file,
    };
    db.questions.update({ _id: questionId }, updatedQuestion);
    db.questions.persistence.compactDatafile();
    db.questions.findOne({ _id: questionId }, {}, (err, question) => {
      res.status(200).json(question);
    });
  })

  .get("/download/:fileName", (req, res) => {
    const fileName= req.params?.fileName;
    const filePath = "/var/www/www-root/data/simple-api/public/" + fileName;
    res.download(filePath);  
  })


  .get("/services", (req, res) => {
    const services = db.services.getAllData();
    res.status(200).json(services);
  })

  .post("/services/new", upload.single("img"), (req, res) => {
    const body = req.body;
    body.prices = JSON.parse(JSON.stringify(body.prices));
    const newService = {
      ...body,
      img: "https://podrostok-syktyvkar.ru/img/" + req.file.filename,
    };
    db.services.insert(newService, (err, service) => {
      res.status(200).json(service);
    });
  })

  .delete("/services/delete/:serviceId", (req, res) => {
    const serviceId = req.params?.serviceId;
    db.services.remove({ _id: serviceId });
    res.status(200).json(serviceId);
  })

  .put("/services/update/:serviceId", upload.single("img"), (req, res) => {
    const serviceId = req.params?.serviceId;
    const body = req.body;
    body.prices = JSON.parse(JSON.stringify(body.prices));
    const updatedService = {
      ...body,
      img: req.file
        ? "https://podrostok-syktyvkar.ru/img/" + req.file.filename
        : body.img,
    };
    db.services.update({ _id: serviceId }, updatedService);
    db.services.findOne({ _id: serviceId }, {}, (err, service) => {
      res.status(200).json(service);
    });
  })

  .post("/checkPassword", (req, res) => {
    const body = req.body;
    bcrypt.compare(body.password, adminPassword, (err, result) => {
      result ? res.status(200).json("") : res.sendStatus(403);
    });
  });
