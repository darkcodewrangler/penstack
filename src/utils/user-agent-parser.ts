import { UAParser } from "ua-parser-js";

export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    device: {
      type: device.type || "desktop", // mobile, tablet, desktop
      model: device.model,
      vendor: device.vendor,
    },
    browser: {
      name: browser.name,
      version: browser.version,
    },
    os: {
      name: os.name,
      version: os.version,
    },
  };
};
