import { FeatureProperties } from "@/app/query/[lngLat]/query-card/feature-properties";
import { PropertyCrossings } from "@/app/query/[lngLat]/query-card/property-crossings";
import { tw } from "@/helpers";
import { isLine } from "@/helpers/geojson";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const tab = tw`data-[selected]:bg-white py-2 px-4 font-bold rounded-t-md text-neutral-content data-[selected]:text-base-content data-[selected]:border-x data-[selected]:border-t -mb-px z-10 relative`;

export const FeatureInfo = ({
  feature,
  className,
}: {
  feature: MapboxGeoJSONFeature;
  className?: string;
}) => {
  const router = useRouterWithHash();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(
    parseInt(searchParams.get("tab") ?? "0")
  );

  const setTab = useCallback(
    (tabIndex: number) => {
      setCurrentTab(tabIndex);
      if (tabIndex.toString() !== searchParams.get("tab")) {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tabIndex.toString());
        router.replace(pathname + "?" + params.toString());
      }
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    if (searchParams.get("tab") === null) {
      setTab(0);
    }
  }, [setTab, searchParams]);

  return (
    <div className={`${className} flex flex-col gap-4 pt-4`}>
      <TabGroup
        className="flex flex-col h-full"
        selectedIndex={currentTab}
        onChange={setTab}
      >
        <TabList>
          <Tab className={tab}>Feature Properties</Tab>
          {isLine(feature) ? (
            <Tab className={tab}>Property Crossings</Tab>
          ) : null}
        </TabList>
        <TabPanels className="bg-white flex-1 rounded-b-lg rounded-e-lg overflow-y-scroll border relative">
          <TabPanel>
            {/** just to test that the API works.. */}
            <button
              className="btn"
              onClick={() => {
                const params = new URLSearchParams();
                fetch(`/a/crossings/eastside_reroutes/${feature.id}`);
              }}
            >
              I am a button
            </button>
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
