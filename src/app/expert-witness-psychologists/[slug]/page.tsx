import client from "../../../../tina/__generated__/client";
import { makeSlugPage } from "@/lib/tina-page-helpers";

const { generateMetadata, generateStaticParams, Page } = makeSlugPage({
  queryFn: (args) => client.queries.expertWitness(args),
  connectionFn: () => client.queries.expertWitnessConnection(),
  dataKey: "expertWitness",
  connectionKey: "expertWitnessConnection",
  collection: "expertWitness",
  canonicalPrefix: "/expert-witness-psychologists/",
});

export { generateMetadata, generateStaticParams };
export default Page;
