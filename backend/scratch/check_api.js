/**
 * Uses the backend REST API to patch the settings in DB.
 * No direct MongoDB connection needed.
 */
const http = require("http");

// We need an admin token first — let's use the login endpoint
async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // Step 1: Login as admin to get a token
  console.log("Logging in...");
  const loginRes = await httpRequest(
    {
      hostname: "localhost",
      port: 8092,
      path: "/api/admin/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "admin@kalkibrand.com", password: "admin123" }
  );

  if (!loginRes.body?.token) {
    console.error("Login failed. Status:", loginRes.status, "\nBody:", JSON.stringify(loginRes.body, null, 2));
    console.log("\n⚠️  Please check admin credentials in the admin panel.");
    process.exit(1);
  }

  const token = loginRes.body.token;
  console.log("✅ Logged in. Token obtained.");

  // Step 2: Get current global setting
  const globalRes = await httpRequest({
    hostname: "localhost",
    port: 8092,
    path: "/api/setting/global",
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  console.log("\nCurrent globalSetting:", JSON.stringify(globalRes.body?.setting || globalRes.body, null, 2));
}

main().catch(console.error);
