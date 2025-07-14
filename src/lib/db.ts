import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function saveInvoice({
  customerName,
  date,
  usdToThbRate,
  thbToMmkRate,
  items,
  totals
}: {
  customerName: string;
  date: string;
  usdToThbRate: number;
  thbToMmkRate: number;
  items: { description: string; amount: number }[];
  totals: { usd: string; thb: string; mmk: string; final: string };
}) {
  return await prisma.invoice.create({
    data: {
      customerName,
      date: new Date(date),
      usdToThbRate,
      thbToMmkRate,
      totalUsd: parseFloat(totals.usd),
      totalThb: parseFloat(totals.thb),
      totalMmk: parseFloat(totals.mmk),
      finalMmk: parseFloat(totals.final),
      items: {
        create: items.map(item => ({
          description: item.description,
          amount: item.amount
        }))
      }
    },
    include: {
      items: true
    }
  });
}

export async function getInvoices() {
  return await prisma.invoice.findMany({
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}