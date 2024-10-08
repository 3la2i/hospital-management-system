import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const PayPalPayment = ({ amount, userId, appointmentId }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const createOrder = async () => {
    try {
      const response = await axios.post("http://localhost:4025/api/payments/create-order", { amount });
      return response.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setPaymentError("Failed to create order. Please try again.");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await axios.post(`http://localhost:4025/api/payments/capture-order`, {
        orderId: data.orderID,
        userId : localStorage.getItem("user_id"),
        amount,
        appointmentId
      });
      const details = response.data;

      if (details.status === 'COMPLETED') {
        setPaymentSuccess(true);
        console.log(`Transaction completed successfully by ${details.payer.name.given_name}`);
      } else {
        setPaymentError(`Transaction failed: ${details.status}`);
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setPaymentError("There was an issue processing your payment.");
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {paymentError && <div className="text-red-500 mb-4">{paymentError}</div>}
        {paymentSuccess ? (
          <div className="text-green-500 mb-4">Payment successful!</div>
        ) : (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            style={{ layout: "vertical" }}
          />
        )}
      </div>
    </div>
  );
};

export default PayPalPayment;