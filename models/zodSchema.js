const z = require("zod");

// const appealBodySchema = z.object({
//   pincode: z.number(),
//   area: z.string(),
//   isNewPincode: z.string(),
//   reqMadeBy: z.string()
// })
const appealBodySchema = z.object({
  pincode: z.string(),
  area: z.string(),
})
const searchZodSchema = z.number();

const notesBodySchema = z.object({
  note: z.string()
})

module.exports = { appealBodySchema, searchZodSchema, notesBodySchema }