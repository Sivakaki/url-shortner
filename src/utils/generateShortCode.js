import crypto from "crypto";
import { Url } from "../models/url.model.js";

const generateShortCode = async () => {
  return crypto.randomBytes(4).toString("base64url");
};

export { generateShortCode };
