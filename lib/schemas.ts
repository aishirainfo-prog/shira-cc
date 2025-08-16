import { z } from "zod";
export const ModuleKey = z.enum(["FOOT","QUIZ","TENNIS","WFL","SUP","TENL","EJP"]);
export const HeartbeatSchema = z.object({ module: ModuleKey, verified: z.boolean(), freshnessSec: z.number().nonnegative(), timeDriftMs: z.number(), ts: z.string() });
export const TicketEventSchema = z.object({ event: z.string(), market: z.string(), pick: z.string(), odds: z.number().positive(), confidence: z.number().min(0).max(1), ev: z.number().positive().nullable() });
export const TicketSchema = z.object({ id: z.string(), module: ModuleKey, type: z.enum(["COMBO","SISTEMA","SINGOLE","ALT"]), stake: z.number().positive(), totalOdds: z.number().positive(), potentialWin: z.number().positive(), confidence: z.number().min(0).max(1), ev: z.number().positive(), mode: z.enum(["VERIFIED","SIMULAZIONE"]), items: z.array(TicketEventSchema), ts: z.string() });
export const ValidationSchema = z.object({ module: ModuleKey, runId: z.string(), results: z.array(z.object({ ticketId: z.string(), hit: z.boolean(), payout: z.number().nonnegative(), delta: z.number() })), ts: z.string() });
export type Heartbeat = z.infer<typeof HeartbeatSchema>; export type Ticket = z.infer<typeof TicketSchema>; export type Validation = z.infer<typeof ValidationSchema>;
