import { useEffect, useState } from "react";
import "./App.css";
import Form from "./components/Form";
import Navbar from "./components/Navbar";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51LnQoMGgMonZaOhl25UczvPtAoAY1V35YnB77f3z0Mi8VSdsYXjKtc03fORIuSFtaId4ghEXGV7LqrwAArJY5fmA00Fse963QK"
);

function App() {
  const [areaCodes, setAreaCodes] = useState([]);
  const [price, setPrice] = useState(300);
  const [clientSecret, setClientSecret] = useState("");

  const appearance = {
    theme: "night",
  };
  const options = {
    clientSecret,
    // appearance,
  };

  function getAreaCodes() {
    axios
      .get("us_area_codes.json")
      .then((response) => setAreaCodes(response))
      .catch((err) => console.log(err));
  }

  function createPaymentIntent() {
    axios
      .post("https://localhost:3001/createPayment", {
        body: price,
      })
      // .then((res) => setClientSecret(res.clientSecret))
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    createPaymentIntent();
    getAreaCodes();
    console.log(clientSecret);
  }, []);
  return (
    <div className="App">
      <Navbar />
      <Elements stripe={stripePromise} options={options}>
        {/* <Form clientSecret={clientSecret} areaCodes={areaCodes} /> */}
      </Elements>
    </div>
  );
}

export default App;
