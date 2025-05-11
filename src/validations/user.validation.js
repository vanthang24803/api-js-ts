const { z } = require("zod");

const validationUpdateProfileSchema = z.object({
  username: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  gender: z.string().max(10).optional(),
  address: z.string().max(255).optional(),
});

module.exports = {
  validationUpdateProfileSchema,
};
