const { z } = require("zod");

const validationLoginSchema = z.object({
  username: z.string().min(3).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(6).max(255),
});

const validationRegisterSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  phone: z.string().optional(),
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  gender: z.string().max(10),
  address: z.string().max(255).optional(),
  dateOfBirth: z.string().optional(),
});

module.exports = {
  validationLoginSchema,
  validationRegisterSchema,
};
