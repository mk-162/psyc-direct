import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Use the same env variable that Tina uses
  const tinaApiUrl = process.env.NEXT_PUBLIC_TINA_API_URL || "http://localhost:4001/graphql";

  // Determine collection based on path
  const isUtility = path.includes("utility/") || path.endsWith(".md");
  const collection = isUtility ? "utilities" : "pages";
  
  const query = isUtility ? `
    query GetUtility($relativePath: String!) {
      utilities(relativePath: $relativePath) {
        title
        ... on Utilities {
          blocks {
            __typename
            ... on UtilitiesBlocksRichText {
              richText {
                markdown
              }
            }
            ... on UtilitiesBlocksMarkdown {
              markdown {
                html
              }
            }
          }
        }
      }
    }
  ` : `
    query GetPage($relativePath: String!) {
      pages(relativePath: $relativePath) {
        title
        ... on Pages {
          blocks {
            __typename
            ... on PagesBlocksRichText {
              richText {
                markdown
              }
            }
            ... on PagesBlocksMarkdown {
              markdown {
                html
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(tinaApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { relativePath: path },
      }),
    });

    const data = await res.json();
    const page = isUtility ? data.data?.utilities : data.data?.pages;

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Extract content from blocks
    let html = "";
    if (page.blocks) {
      for (const block of page.blocks) {
        if (block?.__typename === "PagesBlocksRichText") {
          html += block?.richText?.markdown || "";
        } else if (block?.__typename === "PagesBlocksMarkdown") {
          html += block?.markdown?.html || "";
        }
      }
    }

    return NextResponse.json({
      page: {
        title: page.title,
        html,
      },
    });
  } catch (error) {
    console.error("Tina fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}
