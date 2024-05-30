import { FeatureProperties } from "@/app/query/[lngLat]/query-card/feature-properties";
import { PropertyCrossings } from "@/app/query/[lngLat]/query-card/property-crossings";
import { tw } from "@/helpers";
import { isLine } from "@/helpers/geojson";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { MapboxGeoJSONFeature } from "mapbox-gl";

const tab = tw`data-[selected]:bg-white py-2 px-4 font-bold rounded-t-md text-neutral-content data-[selected]:text-base-content data-[selected]:border-x data-[selected]:border-t -mb-px z-10 relative`;

export const FeatureInfo = ({
  feature,
  className,
}: {
  feature: MapboxGeoJSONFeature;
  className?: string;
}) => {
  return (
    <div className={`${className} flex flex-col gap-4 pt-4`}>
      <TabGroup className="flex flex-col h-full">
        <TabList>
          <Tab className={tab}>Feature Properties</Tab>
          {isLine(feature) ? (
            <Tab className={tab}>Property Crossings</Tab>
          ) : null}
        </TabList>
        <TabPanels className="bg-white flex-1 rounded-b-lg rounded-e-lg overflow-y-scroll border relative">
          <TabPanel>
            <FeatureProperties feature={feature} />
          </TabPanel>
          {isLine(feature) ? (
            <TabPanel>
              <PropertyCrossings feature={feature} />
            </TabPanel>
          ) : null}
        </TabPanels>
      </TabGroup>
    </div>
  );
};
