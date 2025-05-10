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
  first_name: z.string().max(100),
  last_name: z.string().max(100),
  gender: z.string().max(10),
  address: z.string().max(255).optional(),
  date_of_birth: z.string().optional(),
  roles: z.array(z.string()).min(1),
  active: z.boolean(),
  timezone: z.string().max(50),
});

module.exports = {
  validationLoginSchema,
  validationRegisterSchema,
};
