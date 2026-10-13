import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s-]{10,20}$/, "Informe um telefone com DDD."),
  email: z.union([z.email("Confira o seu e-mail."), z.literal("")]).optional(),
  message: z.string().trim().max(2000).optional(),
  kind: z.enum(["contato", "financiamento", "avaliacao", "test-drive"]),
  consent: z
    .boolean()
    .refine((v) => v, "Autorize o uso dos dados para este atendimento."),
  website: z.string().max(200).optional(),
  utm: z.record(z.string(), z.string().max(300)).optional(),
});
export type Lead = z.infer<typeof leadSchema>;
