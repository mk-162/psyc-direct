import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.tools(args),
  connectionFn: () => client.queries.toolsConnection(),
  dataKey: "tools",
  connectionKey: "toolsConnection",
  collection: "tools",
  canonicalPrefix: "/tools/",
});

export { generateMetadata, generateStaticParams };
export default Page;
