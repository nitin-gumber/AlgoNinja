import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { sendMail } from '../utils/sendMail.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { planName, amount } = req.body;
  const userId = req.user.id;

  try {
    if (!['Pro', 'Premium'].includes(planName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan choice submitted.',
      });
    }

    const PLAN_BOOK = {
      Pro: 199900, //Rs 1999
      Premium: 499900, // Rs 4999
    };

    if (PLAN_BOOK[planName] !== amount) {
      return res.status(400).json({
        success: false,
        message: 'Price alteration mismatch flagged by security boundary!',
      });
    }

    const receipt = `rcpt_ninja_${userId.slice(-5)}_${Date.now().toString().slice(-4)}`;

    const order = await razorpay.orders.create({
      amount: PLAN_BOOK[planName],
      currency: 'INR',
      receipt,
    });

    await Payment.create({
      userId,
      razorpayOrderId: order.id,
      planName,
      amount: PLAN_BOOK[planName],
      status: 'created',
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error inside createOrder engine context:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed creating server transaction tokens.',
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planName } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const duplicatePaymentCheck = await Payment.findOne({
      razorpayPaymentId,
      status: 'captured',
    }).session(session);

    if (duplicatePaymentCheck) {
      await session.abortTransaction();
      return res.status(200).json({
        success: true,
        message: 'Payment verified already via parallel micro-squences',
      });
    }

    // CRYPTOGRAPHIC INTEGRITY CHECK: Generate strict HMAC signature check matching razorpay core laws
    const tokenSignaturePayload = razorpayOrderId + '|' + razorpayPaymentId;

    console.log('tokenSignaturePayload', tokenSignaturePayload);

    const computedSignatureHex = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(tokenSignaturePayload)
      .digest('hex');

    console.log('ComputedSignatureHex', computedSignatureHex);

    if (computedSignatureHex !== razorpaySignature) {
      await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' }, { session });
      await session.commitTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cryptographic validation signature corrupted or invalid!',
      });
    }

    const transactionDetails = await razorpay.payments.fetch(razorpayPaymentId);

    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        status: 'captured',
        razorpayPaymentId,
        capturedAt: new Date(),
        paymentMethod: transactionDetails.method || 'unkown',
        cardLast4: transactionDetails.card?.last4 || null,
        cardNetwork: transactionDetails.card?.network || null,
      },
      { session },
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        plan: planName.toLowerCase(),
        planActivedAt: new Date(),
      },
      { session, new: true },
    );

    await session.commitTransaction();
    session.endSession();

    // Send the email to user
    try {
      await sendMail({
        to: userDetails.email,
        subject: 'AlgoNinja Subscription Activated!',
        message: `Congratulations! Your AlgoNinja ${planName} Access layer has been successfully provisioned.`,
        htmlMessage: subscriptionEmailTemplate(
          userDetails.name,
          planName,
          userDetails.planActivedAt,
          userDetails.email,
          razorpayPaymentId,
          transactionDetails.amount / 100,
          transactionDetails.method,
          transactionDetails.card?.network,
          transactionDetails.card?.last4,
        ),
      });
    } catch (mailError) {
      console.error('Mail Transmission Failure Logging:', mailError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Congratulations! Your AlgoNinja ${planName} Access layer has been successfully provisioned.`,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Payment cryptographic resolution crash intercepted:', error);
    if (razorpayOrderId) {
      await Payment.findByIdAndUpdate({ razorpayOrderId, status: 'created' }, { status: 'failed' });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal pipeline handling errors.',
    });
  } finally {
    session.endSession();
  }
};
