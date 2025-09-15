import { z } from "zod"

export const createBudgetSchema = z
  .object({
    name: z.string().min(1, "Budget name is required").max(200, "Budget name too long"),
    fiscal_year: z.number().min(2020, "Invalid fiscal year").max(2050, "Invalid fiscal year"),
    start_date: z.string().date("Invalid start date"),
    end_date: z.string().date("Invalid end date"),
    total_budget: z.number().min(0, "Budget cannot be negative"),
    status: z.enum(["draft", "active", "closed"]).default("draft"),
    line_items: z
      .array(
        z.object({
          account_id: z.string().uuid("Invalid account ID"),
          category: z.string().min(1, "Category is required"),
          budgeted_amount: z.number().min(0, "Budgeted amount cannot be negative"),
          notes: z.string().optional(),
        }),
      )
      .default([]),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })

export const createTransactionSchema = z
  .object({
    transaction_date: z.string().date("Invalid transaction date"),
    reference_number: z.string().optional(),
    description: z.string().min(1, "Description is required").max(500, "Description too long"),
    total_amount: z.number().refine((val) => val !== 0, "Amount cannot be zero"),
    currency: z.string().default("USD"),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
    line_items: z
      .array(
        z.object({
          account_id: z.string().uuid("Invalid account ID"),
          description: z.string().optional(),
          debit_amount: z.number().min(0, "Debit amount cannot be negative").default(0),
          credit_amount: z.number().min(0, "Credit amount cannot be negative").default(0),
        }),
      )
      .min(1, "At least one line item is required"),
  })
  .refine(
    (data) => {
      const totalDebits = data.line_items.reduce((sum, item) => sum + item.debit_amount, 0)
      const totalCredits = data.line_items.reduce((sum, item) => sum + item.credit_amount, 0)
      return Math.abs(totalDebits - totalCredits) < 0.01 // Allow for small rounding differences
    },
    {
      message: "Total debits must equal total credits",
      path: ["line_items"],
    },
  )

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
