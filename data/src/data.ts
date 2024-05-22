import { ArcGISResponse } from "~/types/geo-json";

const PAGE_SIZE = 2000;

export const getFullGeoJson = (endpoint: string, properties = "*") => {
  return concurrentFetchGeoJson({ endpoint, properties });
};

export const concurrentFetchGeoJson = async ({
  endpoint,
  properties,
  merge = [],
  concurrent = 6,
}: {
  endpoint: string;
  properties: string;
  merge?: ArcGISResponse[];
  concurrent?: number;
}): Promise<ArcGISResponse> => {
  const results = await Promise.all(
    constructFetches({ endpoint, concurrent, properties })
  );
  const cleanResults = results.filter(
    (res) => res !== undefined
  ) as unknown as ArcGISResponse[];
  if (
    cleanResults[cleanResults.length - 1]?.properties?.exceededTransferLimit
  ) {
    return concurrentFetchGeoJson({
      endpoint,
      merge: cleanResults,
      properties,
    });
  }
  return combineResults([...merge, ...cleanResults]);
};

const combineResults = (results: ArcGISResponse[]) =>
  results.slice(1).reduce((combined, result) => {
    delete combined.properties;
    return {
      ...combined,
      features: [...combined.features, ...result.features],
    };
  }, results[0]);

const constructFetches = ({
  endpoint,
  concurrent,
  properties,
}: {
  endpoint: string;
  concurrent: number;
  properties: string;
}) => {
  if (concurrent < 1) throw Error("Cannot construct less than 1 fetch");
  return Array.from(Array(concurrent)).map((_, i) =>
    fetchGeoJson({ endpoint, offset: PAGE_SIZE * i, properties })
  );
};

export const fetchGeoJson = async ({
  endpoint,
  properties,
  offset = 0,
}: {
  endpoint: string;
  properties: string;
  offset: number;
}): Promise<ArcGISResponse | undefined> => {
  const url = new URL(endpoint);
  url.searchParams.append("where", "1=1");
  url.searchParams.append("returnExceededLimitFeatures", "true");
  url.searchParams.append("f", "pgeojson");
  url.searchParams.append("outFields", properties);
  if (offset) {
    url.searchParams.append("resultOffset", offset.toString());
  }
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json() as Promise<ArcGISResponse>;
    }
  });
};
