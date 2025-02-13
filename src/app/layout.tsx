import type { Metadata, ResolvingMetadata } from "next";
import "./globals.css";
import "./tiptap.css";
import "./calendar.css";
import { fonts } from "../lib/fonts";
import { ChakraProvider } from "../providers/chakra";
import ReactQueryClient from "../providers/react-query";
import AuthProvider from "../providers/auth";
import { getSession } from "../lib/auth/next-auth";
import { SiteConfigProvider } from "../context/SiteConfig";
import { getSettings } from "../lib/settings";
import { NuqsProvider } from "../providers/nuqs";

type Props = {
  params: { slug?: string } & Record<string, string | string[] | undefined>;
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  _: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteConfig = await getSettings();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: siteConfig?.siteName?.value,
    description: siteConfig?.siteDescription?.value,
    icons: {
      icon: siteConfig?.siteFavicon?.value || "/favicon.ico",
      shortcut: siteConfig?.siteFavicon?.value || "/favicon.ico",
      apple: siteConfig?.siteFavicon?.value || "/favicon.ico",
    },
    openGraph: {
      title: siteConfig?.siteName?.value,
      description: siteConfig?.siteDescription?.value,

      siteName: siteConfig?.siteName?.value,
      images: [
        {
          url:
            siteConfig.siteOpengraph?.value ||
            `/api/og?title=${siteConfig.siteName?.value}`,
          width: 1200,
          height: 630,
        },
        ...previousImages,
      ],
      locale: "en-US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const initialConfig = await getSettings();

  return (
    <html
      lang="en"
      className={`${fonts.body.variable} ${fonts.heading.variable}`}
    >
      <body>
        <SiteConfigProvider initialConfig={initialConfig}>
          <ReactQueryClient>
            <AuthProvider session={session}>
              <NuqsProvider>
                <ChakraProvider>{children}</ChakraProvider>
              </NuqsProvider>
            </AuthProvider>
          </ReactQueryClient>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
