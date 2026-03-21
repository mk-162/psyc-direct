import client from "../../../tina/__generated__/client";
import { makeOverviewPage } from "@/lib/tina-page-helpers";

const { generateMetadata, Page } = makeOverviewPage({
  queryFn: (args) => client.queries.about(args),
  dataKey: "about",
  collection: "about",
  canonicalPath: "/about/",
  defaultTitle: "About Psychology Direct",
  fallback: {
    title: "About Psychology Direct",
    subtitle: "15+ years connecting organisations with expert psychologists",
    ctaText: "Get in Touch",
  },
});

export { generateMetadata };
export default Page;
