import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const body = await request.json();
if (!body.customerName || !body.date || !body.usdToThbRate || !body.thbToMmkRate || !body.totals || !body.items) {
  return NextResponse.json(
    { error: 'Invalid request body' },
    { status: 400 }
  );
}
    const invoice = await prisma.invoice.create({
      data: {
        status: 'pending',
        customer: body.customerName,
        date: new Date(body.date),
        usdToThbRate: body.usdToThbRate,
        thbToMmkRate: body.thbToMmkRate,
        totalUsd: parseFloat(body.totals.usd),
        totalThb: parseFloat(body.totals.thb),
        totalMmk: parseFloat(body.totals.mmk),
        finalMmk: parseFloat(body.totals.final),
        items: {
          create: body.items.map((item: { description: string; amount: number }) => ({
            description: item.description,
            amount: item.amount
          }))
        }
      },
      include: {
        items: true
      }
    });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Failed to save invoice:', error);
    return NextResponse.json(
      { error: 'Failed to save invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }
    
    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: parseInt(id) }
    });

    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.invoiceItem.deleteMany({
        where: { invoiceId: parseInt(id) }
      }),
      prisma.invoice.update({
        where: { id: parseInt(id) },
        data: {
          customer: data.customerName,
          date: new Date(data.date),
          usdToThbRate: data.usdToThbRate,
          thbToMmkRate: data.thbToMmkRate,
          totalUsd: parseFloat(data.totals.usd),
          totalThb: parseFloat(data.totals.thb),
          totalMmk: parseFloat(data.totals.mmk),
          finalMmk: parseFloat(data.totals.final),
          items: {
            create: data.items.map((item: { description: string; amount: number }) => ({
              description: item.description,
              amount: item.amount
            }))
          }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: { status: data.status }
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    if (id) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: parseInt(id) },
        include: { items: true }
      });

      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(invoice);
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

