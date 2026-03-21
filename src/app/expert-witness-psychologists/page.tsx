import client from "../../../tina/__generated__/client";
import { makeOverviewPage } from "@/lib/tina-page-helpers";

const { generateMetadata, Page } = makeOverviewPage({
  queryFn: (args) => client.queries.expertWitness(args),
  dataKey: "expertWitness",
  collection: "expertWitness",
  canonicalPath: "/expert-witness-psychologists/",
  defaultTitle: "Expert Witness Psychologists & Psychiatrists | Psychology Direct",
  fallback: {
    title: "Expert Witness Services",
    subtitle: "Court-ready reports from vetted psychologists and psychiatrists",
    ctaText: "Instruct an Expert",
  },
});

export { generateMetadata };
export default Page;
