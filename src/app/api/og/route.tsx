import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, host } = new URL(request.url);

    const username = searchParams.get("username") || "";
    const name = searchParams.get("name") || "";
    const avatar = searchParams.get("avatar") || "";
    const title = searchParams.get("title") || "";
    const category = searchParams.get("category") || "";
    const publishDate = searchParams.get("date") || new Date().toISOString();
    const readingTime = searchParams.get("readingTime");

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",

            background: "white",
            position: "relative",
          }}
        >
          {/* Content Section */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "60px",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
            }}
          >
            {/* Category & Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {category && (
                <div
                  style={{
                    // background:
                    //   "linear-gradient(90deg, rgba(223, 113, 85, 1) 0%, rgba(59, 6, 66, 1) 10%)",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "2px solid #1a1a1a",
                    display: "flex",
                    // color: "white",
                    fontSize: "20px",
                    fontWeight: "semibold",
                  }}
                >
                  {category}
                </div>
              )}

              {/* Title */}
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  // color: "white",
                  display: "flex",
                  lineHeight: 1.2,
                  marginBottom: "18px",
                  maxWidth: "80%",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  color: "#4a4a4a",
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {formatDate(publishDate)}{" "}
                {readingTime && `· ${readingTime} min read time`}
              </div>
            </div>

            {/* Author Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "60px",
              }}
            >
              {name && (
                <p
                  style={{
                    // color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  By
                </p>
              )}
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  width={45}
                  height={45}
                  alt={name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "128px",
                    border: "2px solid #1a1a1a",
                  }}
                />
              ) : (
                name && (
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "128px",

                      // background:
                      //   "linear-gradient(90deg, rgba(223, 113, 85, 1) 0%, rgba(59, 6, 66, 1) 10%)",
                      // color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      border: "2px solid #1a1a1a",
                      textTransform: "uppercase",
                    }}
                  >
                    <p>{getNameInitials(name)}</p>
                  </div>
                )
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {name && (
                  <div
                    style={{
                      // color: "white",
                      fontSize: "24px",
                      fontWeight: "bold",
                      display: "flex",
                    }}
                  >
                    {name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            style={{ position: "absolute", bottom: 0, left: 0 }}
          >
            <path
              fill="#0099ff"
              fill-opacity="1"
              d="M0,256L80,245.3C160,235,320,213,480,208C640,203,800,213,960,186.7C1120,160,1280,96,1360,64L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
          <svg
            style={{ position: "absolute", top: 0, left: 0 }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#0099ff"
              fill-opacity="1"
              d="M0,224L80,202.7C160,181,320,139,480,112C640,85,800,75,960,90.7C1120,107,1280,149,1360,170.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
          {/* Watermark/Brand */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "50px",
              display: "flex",
              zIndex: 10,

              fontSize: "20px",
            }}
          >
            {host}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Plus+Jakarta+Sans",
            data: await loadGoogleFont("Plus+Jakarta+Sans", title),
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}

function getNameInitials(name: string) {
  const names = name.split(" ");
  if (names.length === 1) {
    return name.slice(0, 2);
  }
  return names[0].charAt(0) + names[names.length - 1].charAt(0);
}
