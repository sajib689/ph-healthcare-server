import Stripe from "stripe";
import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { stripe } from "../../helper/stripe";
import config from "../../../config";
import { prisma } from "../../shared/prisma";

const stripeWebhook = async (body: Buffer, signature: string) => {

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    config.STRIPE_WEBHOOK_SECRET!,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      console.log(appointmentId, paymentId);
      if (!appointmentId) break;

      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findFirst({
          where: {
            appointmentId,
          },
        });

        if (!payment) return;

        // updated the payment data
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGateWayData: session as any,
          },
        });

        // updated the appointment data
        const appointment = await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            status: AppointmentStatus.SCHEDULED,
          },
        });

        // updated the doctorSchedule data

        await tx.doctorSchedule.update({
          where: {
            doctorId_scheduleId: {
              doctorId: appointment.doctorId,
              scheduleId: appointment.scheduleId,
            },
          },
          data: {
            isBooked: true,
          },
        });
      });

      break;
    }

    default:
      console.log(`Unhandled event ${event.type}`);
  }

  return {
    received: true,
  };
};

export const PaymentService = {
  stripeWebhook,
};
