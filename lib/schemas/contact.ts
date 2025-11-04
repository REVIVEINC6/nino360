import { z } from 'zod';

export const ContactCreate = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  display_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  organization_name: z.string().optional(),
});

export const ContactUpdate = ContactCreate.extend({
  id: z.string().uuid(),
});

export type ContactCreateType = z.infer<typeof ContactCreate>;
export type ContactUpdateType = z.infer<typeof ContactUpdate>;
