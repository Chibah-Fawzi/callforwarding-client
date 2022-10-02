import React, { useEffect, useState } from "react";

import {
  useStripe,
  useElements,
  PaymentElement,
  CardElement,
} from "@stripe/react-stripe-js";

export default function Form(props) {
  const { areaCodes, clientSecret } = props;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <div className="formWrapper" onSubmit={handleSubmit}>
      <h1>Buy a virtual US number</h1>
      <form>
        <div className="row">
          <div className="inputWrapper">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />
          </div>
          <div className="inputWrapper">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
        </div>

        <div className="row">
          <div className="inputWrapperNumber">
            <div className="inputWrapper">
              <label>Current Number</label>
              <input type="number" placeholder="Enter your current number" />
            </div>
            {/* <i>The number you want the calls to get forward to</i> */}
          </div>
          <div className="inputWrapperNumber">
            <div className="inputWrapper">
              <label>Area Code</label>
              <select>
                <option value="" key="">
                  Enter your area code
                </option>
              </select>
            </div>
            {/* <i>First digit of your new US number</i> */}
          </div>
        </div>
        <div className="inputWrapper">
          <label>Payment element</label>
          <div
            style={{
              border: "1px solid black",
              minHeight: "30px",
              padding: "30px",
            }}
          >
            <PaymentElement />
          </div>
        </div>

        <button type="submit">Buy Number</button>
      </form>
    </div>
  );
}
