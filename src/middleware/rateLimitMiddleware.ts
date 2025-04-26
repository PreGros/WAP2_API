import rateLimit from "express-rate-limit";

export const apiRateLimit = rateLimit({
  windowMs: 10 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});