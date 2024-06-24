'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transactions.model';
import { updateCredits } from './user.actions';

export async function checkoutCredits(transactions: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transactions.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: transactions.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transactions.plan,
      credits: transactions.credits,
      buyerId: transactions.buyerId,
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
}

export async function createTransaction(transactions: CreateTransactionParams) {
  try {
    await connectToDatabase();

    //create new transaction with buyerId

    const newTransaction = await Transaction.create({
      ...transactions,
      buyer: transactions.buyerId,
    });

    //update the credits
    await updateCredits(transactions.buyerId, transactions.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
