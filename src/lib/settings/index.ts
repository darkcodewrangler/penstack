import "server-only";
import { cache } from "react";
import { db } from "@/src/db";
import { siteSettings } from "@/src/db/schemas";
import { SiteSettings } from "@/src/types";
import { DEFAULT_SETTINGS } from "./config";
import { isSecretKey } from "@/src/utils";
import { decryptKey, encryptKey } from "../encryption";

import { unstable_cache } from "next/cache";

export const getSettings = unstable_cache(
  async () => {
    const settings = await db.select().from(siteSettings);

    const settingsObj = settings.reduce((acc, setting) => {
      const value =
        isSecretKey(setting.key) && setting.value
          ? decryptKey(setting.value)
          : setting.value;

      acc[setting.key] = {
        value: value || "",
        enabled: setting.enabled as boolean,
      };
      return acc;
    }, {} as SiteSettings);

    return { ...DEFAULT_SETTINGS, ...settingsObj };
  },
  ["getSettings"],
  { tags: ["settings", "getSettings"] }
);

export async function updateSettings(newSettings: SiteSettings) {
  const operations = Object.entries(newSettings).map(([key, setting]) => {
    const value =
      isSecretKey(key) && setting.value
        ? encryptKey(setting.value)
        : setting.value;

    return db
      .insert(siteSettings)
      .values({
        key,
        value,
        enabled: setting.enabled,
      })
      .onDuplicateKeyUpdate({
        set: { key, value, updated_at: new Date() },
      });
  });

  for (const operation of operations) {
    await operation;
  }
}
