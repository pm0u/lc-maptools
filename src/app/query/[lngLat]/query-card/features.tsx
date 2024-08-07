import { FeatureInfo } from "@/app/query/[lngLat]/query-card/feature-info";
import { useCardContext } from "@/components/card/context";
import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { getFeatureName } from "@/lib/data";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Features = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const { selectFeature, clearSelectedFeatures, zoomToFeature } =
    useMapboxMapContext();
  const containerEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [currentFeature, setCurrentFeature] = useState(
    features.find(
      (f) =>
        f.id?.toString() ===
        (searchParams.get("feature") ?? (features[0].id as string))
    ) ?? features[0]
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const router = useRouterWithHash();
  const { onClose } = useCardContext();

  useEffect(() => {
    if (searchParams.get("fit") === "true") {
      if (currentFeature) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("fit");
        router.replace(pathname + "?" + params.toString());
        zoomToFeature(currentFeature);
      }
    }
  }, [currentFeature, zoomToFeature, searchParams, pathname]);

  useEffect(() => {
    if (searchParams.get("feature") !== currentFeature.id?.toString()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("feature", currentFeature.id as string);
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
            {getFeatureName(currentFeature)}
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
