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
  const [clientSecret, setClientSecret] = useState();
  const [loading, setLoading] = useState(true);

  const appearance = {
    theme: "night",
  };
  const options = {
    clientSecret,
    // appearance,
  };

  function formatAreaCodes(data) {
    var objEntries = Object.entries(data);

    var codes = objEntries.map((e) => e[1]);
    var areas = objEntries.map((e) => e[0]);

    let acObj;
    let areaCode = [];

    for (let i = 0; i < areas.length; i++) {
      for (let j = 0; j < codes[i].length; j++) {
        if (objEntries[i][0] === areas[i]) {
          acObj = {
            area: areas[i],
            code: codes[i][j],
          };
          areaCode.push(acObj);
          setAreaCodes(areaCode);
          // console.log(areaCode.area + " - " + areaCode.code);
        }
      }
    }
  }

  async function getAreaCodes() {
    await axios
      .get("us_area_codes.json")
      .then((response) => formatAreaCodes(response?.data))
      .catch((err) => console.log(err));
  }

  async function handlePaymentIntent() {
    await axios
      .post("http://localhost:3001/createPayment", {
        price,
      })
      .then((res) => {
        // console.log(res.data);
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    // handlePaymentIntent();
    getAreaCodes();
  }, []);
  return (
    <div className="App">
      <Navbar />

      {!loading ? (
        <p>Loading ...</p>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <Form clientSecret={clientSecret} areaCodes={areaCodes} />
        </Elements>
      )}
    </div>
  );
}

export default App;
