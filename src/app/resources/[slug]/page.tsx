import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.resources(args),
  connectionFn: () => client.queries.resourcesConnection(),
  dataKey: "resources",
  connectionKey: "resourcesConnection",
  collection: "resources",
  canonicalPrefix: "/resources/",
});

export { generateMetadata, generateStaticParams };
export default Page;
