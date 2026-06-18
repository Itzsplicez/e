const express = require("express");
const path = require("path");
const paypal = require("@paypal/checkout-server-sdk");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const clientId = "Aej7fxdMW8Sh5ScyoTTPd8WVZn6JSUxO6f_ErSHRFkqNj_6chuwvDBMUAlsOVjoT5I3B-sB8MReDMSKt";
const clientSecret = "EDNB-beOk5RAFbNCHyGpdtD9sPu-colqLGo7XFJydQQQxoP3Yp87qVe-W72_22-I0AMsQcjDtiGE6kik";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/create-order", async (req, res) => {
const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");

request.requestBody({
intent: "CAPTURE",
purchase_units: [
{
amount: {
currency_code: "USD",
value: req.body.amount
}
}
]
});

try {
const order = await client.execute(request);
res.json({ id: order.result.id });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post("/capture-order", async (req, res) => {
const request = new paypal.orders.OrdersCaptureRequest(req.body.orderID);

try {
const capture = await client.execute(request);
res.json(capture.result);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.listen(3000);
