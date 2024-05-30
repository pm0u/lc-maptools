import { FeatureProperties } from "@/app/query/[lngLat]/query-card/feature-properties";
import { PropertyCrossings } from "@/app/query/[lngLat]/query-card/property-crossings";
import { isLine } from "@/helpers/geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const FeatureInfo = ({
  feature,
  className,
}: {
  feature: MapboxGeoJSONFeature;
  className?: string;
}) => {
  return (
    <div className={className}>
      <FeatureProperties feature={feature} />
      {isLine(feature) ? <PropertyCrossings feature={feature} /> : null}
    </div>
  );
};
