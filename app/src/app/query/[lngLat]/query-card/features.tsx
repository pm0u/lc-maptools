import { FeatureInfo } from "@/app/query/[lngLat]/query-card/feature-info";
import { useCardContext } from "@/components/card/context";
import { useMapboxMapContext } from "@/components/mapbox/context";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Features = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const { selectFeature, clearSelectedFeatures } = useMapboxMapContext();
  const containerEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [currentFeature, setCurrentFeature] = useState(
    features[parseInt(searchParams.get("feature") ?? "0")]
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const router = useRouterWithHash();
  const { onClose } = useCardContext();

  useEffect(() => {
    if (searchParams.get("feature") !== `${features.indexOf(currentFeature)}`) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("feature", features.indexOf(currentFeature).toString());
      router.replace(pathname + `?` + newParams.toString());
    }
  }, [currentFeature, features, router, searchParams, pathname]);

  useEffect(() => {
    const off = onClose(clearSelectedFeatures);
    return () => {
      off();
    };
  }, [currentFeature, clearSelectedFeatures, onClose]);

  useEffect(() => {
    if (containerEl.current) {
      const index = features.indexOf(currentFeature);
      const cardWidth = containerEl.current.clientWidth;
      const offset = index * cardWidth;
      setScrollPosition(offset);
    }
    if (currentFeature) {
      selectFeature(currentFeature);
    }
  }, [currentFeature, features, selectFeature]);

  useEffect(() => {
    if (containerEl.current) {
      containerEl.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="pb-2 border-b border-b-base-200">
        <div className="join flex items-center">
          <button
            className="join-item btn"
            disabled={features.indexOf(currentFeature) === 0}
            onClick={() =>
              setCurrentFeature((f) => features[features.indexOf(f) - 1])
            }
          >
            «
          </button>
          <div className="join-item flex-1 text-center font-bold px-2">
            {currentFeature.properties?.name?.trim() ||
              currentFeature.properties?.NAME?.trim() ||
              currentFeature.properties?.description?.trim() ||
              currentFeature.properties?.title?.trim() ||
              currentFeature.properties?.adm_manage?.trim() ||
              "Unknown"}
          </div>
          <button
            className="join-item btn"
            disabled={features.indexOf(currentFeature) === features.length - 1}
            onClick={() => {
              setCurrentFeature((f) => features[features.indexOf(f) + 1]);
            }}
          >
            »
          </button>
        </div>
      </div>
      <div className="overflow-hidden scroll-smooth flex" ref={containerEl}>
        {features.map((feature, i) => (
          <FeatureInfo
            feature={feature}
            key={feature.id ?? i}
            className="min-w-full overflow-y-scroll"
          />
        ))}
      </div>
    </div>
  );
};
