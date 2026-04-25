import http from "http";

const SESSION_ID = "540f9679-c28b-479d-b701-c0e9565303d2";
const TRANSACTION_ID = "TXN-820d9c3d-0018-4a08-bac6-3cf9895ffe07";

const payload = JSON.stringify({
  type: "checkout.session.completed",
  data: {
    object: {
      metadata: {
        sessionId: SESSION_ID,
        transactionId: TRANSACTION_ID,
      },
    },
  },
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/v1/payment/webhook",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": payload.length,
  },
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("Response:", data);
    process.exit(0);
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
  process.exit(1);
});

req.write(payload);
req.end();
