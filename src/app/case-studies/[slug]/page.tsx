import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.caseStudies(args),
  connectionFn: () => client.queries.caseStudiesConnection(),
  dataKey: "caseStudies",
  connectionKey: "caseStudiesConnection",
  collection: "caseStudies",
  canonicalPrefix: "/case-studies/",
  fileExtension: ".md",
});

export { generateMetadata, generateStaticParams };
export default Page;
