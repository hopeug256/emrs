const { MobileClient } = require("../models");

function compareVersion(a = "0.0.0", b = "0.0.0") {
  const pa = String(a).split(".").map((x) => parseInt(x, 10) || 0);
  const pb = String(b).split(".").map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

async function mobileGuard(req, res, next) {
  try {
    const clientId = req.headers["x-mobile-client-id"];
    const apiKey = req.headers["x-mobile-api-key"];
    const sdkVersion = req.headers["x-mobile-sdk-version"];
    if (!clientId || !apiKey || !sdkVersion) {
      return res.status(401).json({ message: "Missing mobile client headers" });
    }
    const client = await MobileClient.findOne({ where: { clientId, apiKey, status: "Active" } });
    if (!client) {
      return res.status(401).json({ message: "Invalid mobile client credentials" });
    }
    if (compareVersion(sdkVersion, client.minSdkVersion) < 0) {
      return res.status(426).json({
        message: "SDK update required",
        minSdkVersion: client.minSdkVersion
      });
    }
    req.mobileClient = client;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = mobileGuard;

