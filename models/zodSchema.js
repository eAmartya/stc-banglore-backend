const z = require("zod");

const writeAdminBodySchema = z.object({
  pincode: z.number(),
  area: z.string()
})
const searchZodSchema = z.number();


module.exports = { writeAdminBodySchema, searchZodSchema }