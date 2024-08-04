import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
    async getCustomers() {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return users?.map(response => {
            const { password, ...allData } = response
            return allData
        })
    }

    async transactionsUser() {
        return await prisma.transaction.findMany({
            orderBy: {
                created_at: 'desc'
            }
        })
    }
}