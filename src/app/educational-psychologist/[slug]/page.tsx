import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.education(args),
  connectionFn: () => client.queries.educationConnection(),
  dataKey: "education",
  connectionKey: "educationConnection",
  collection: "education",
  canonicalPrefix: "/educational-psychologist/",
});

export { generateMetadata, generateStaticParams };
export default Page;
