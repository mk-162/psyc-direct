import client from "../../../tina/__generated__/client";
import { makeOverviewPage } from "@/lib/tina-page-helpers";

const { generateMetadata, Page } = makeOverviewPage({
  queryFn: (args) => client.queries.education(args),
  dataKey: "education",
  collection: "education",
  canonicalPath: "/educational-psychologist/",
  defaultTitle: "Educational Psychologist Services | Psychology Direct",
  fallback: {
    title: "Educational Psychologist Services",
    subtitle: "EHCP assessments, SEND support, and more",
    ctaText: "Discuss Your Needs",
  },
});

export { generateMetadata };
export default Page;
