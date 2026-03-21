import client from "../../../tina/__generated__/client";
import { makeOverviewPage } from "@/lib/tina-page-helpers";

const { generateMetadata, Page } = makeOverviewPage({
  queryFn: (args) => client.queries.resources(args),
  dataKey: "resources",
  collection: "resources",
  canonicalPath: "/resources/",
  defaultTitle: "Resources | Psychology Direct",
  fallback: {
    title: "Resources",
    subtitle: "Guides, tools, and information for legal and education professionals",
    ctaText: "Browse Resources",
  },
});

export { generateMetadata };
export default Page;
