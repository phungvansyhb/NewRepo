import { Prisma } from '@prisma/client';

export interface CreateNewsDto extends Prisma.newsCreateInput {
  assignedUsers?: string[];
  category_id?: string;
}
