import { FeatureInfo } from "@/app/query/[lngLat]/query-card/feature-info";
import { useCardContext } from "@/components/card/context";
import { useMapboxMapContext } from "@/components/mapbox/context";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

export const Features = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const { selectFeature, clearSelectedFeatures } = useMapboxMapContext();
  const [currentFeature, setCurrentFeature] = useState(features[0]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerEl = useRef<HTMLDivElement>(null);
  const { onClose } = useCardContext();

  useEffect(() => {
    const off = onClose(() => clearSelectedFeatures());
    return () => {
      off();
    };
  }, [currentFeature, clearSelectedFeatures, onClose]);

  useEffect(() => {
    setCurrentFeature(features[0]);
  }, [features]);

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
