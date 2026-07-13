/**
 * Updates globalSetting and storeCustomizationSetting via backend REST API
 * to rename the brand to KalkiMart.
 */
const http = require("http");

function apiRequest(options, body) {
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
  // Step 1: Admin login
  const loginRes = await apiRequest(
    {
      hostname: "localhost", port: 8092,
      path: "/api/admin/login", method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "admin@gmail.com", password: "12345678" }
  );

  if (!loginRes.body?.token) {
    console.error("Login failed:", loginRes.status, JSON.stringify(loginRes.body));
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log("✅ Logged in successfully");

  // Step 2: Find the correct route for globalSetting update
  // Try GET first to see current data
  const getRes = await apiRequest(
    {
      hostname: "localhost", port: 8092,
      path: "/api/setting/global", method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    }
  );
  console.log("\nGET /api/setting/global →", getRes.status);
  if (getRes.body?.setting) {
    console.log("  shop_name   :", getRes.body.setting.shop_name);
    console.log("  company_name:", getRes.body.setting.company_name);
  } else {
    console.log("  response:", JSON.stringify(getRes.body).slice(0, 300));
  }

  // Step 3: Update globalSetting shop_name and company_name
  const updGlobal = await apiRequest(
    {
      hostname: "localhost", port: 8092,
      path: "/api/setting/global", method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    },
    { shop_name: "KalkiMart", company_name: "KalkiMart" }
  );
  console.log("\nPUT /api/setting/global →", updGlobal.status);
  console.log("  response:", JSON.stringify(updGlobal.body).slice(0, 300));

  // Step 4: Update storeCustomizationSetting SEO meta_title
  const updSEO = await apiRequest(
    {
      hostname: "localhost", port: 8092,
      path: "/api/setting/store/customization/update", method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    },
    { seo: { meta_title: "KalkiMart - Fresh Grocery & Daily Essentials" } }
  );
  console.log("\nPUT /api/setting/store/customization/update →", updSEO.status);
  console.log("  response:", JSON.stringify(updSEO.body).slice(0, 300));
}

main().catch(console.error);
