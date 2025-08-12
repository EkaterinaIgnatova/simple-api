import { Router } from "express";
import { reviews } from "./mock.js";
import { getById } from "./utils.js";

export default Router()
  .get("/reviews", (req, res, next) => {
    try {
      res.status(200).json(reviews);
    } catch (e) {
      next(e);
    }
  })
  .get("/reviews/:reviewId", (req, res, next) => {
    const reviewId = req.params?.reviewId;
    let review;
    try {
      review = getById(reviews)(reviewId);
      if (!review) res.status(404);
      res.status(200).json(review);
    } catch (e) {
      next(e);
    }
  });
