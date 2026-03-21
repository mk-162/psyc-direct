import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.about(args),
  connectionFn: () => client.queries.aboutConnection(),
  dataKey: "about",
  connectionKey: "aboutConnection",
  collection: "about",
  canonicalPrefix: "/about/",
});

export { generateMetadata, generateStaticParams };
export default Page;
