import { useMapboxMapContext } from "@/components/mapbox/context";
import { MapboxLineFeature } from "@/types/mapbox";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useState } from "react";

export const PropertyCrossings = ({
  feature,
}: {
  feature: MapboxLineFeature;
}) => {
  const [properties, setProperties] = useState<MapboxGeoJSONFeature[]>([]);
  const { propertiesAlongLine, selectFeature } = useMapboxMapContext();

  useEffect(() => {
    const _properties = propertiesAlongLine(feature);
    setProperties(_properties);
  }, [propertiesAlongLine, feature]);
  return (
    <div>
      {properties.map((property) => {
        return (
          <p
            key={property.id}
            onMouseEnter={() => {
              selectFeature(property);
            }}
          >
            {property.properties?.NAME}
          </p>
        );
      })}
    </div>
  );
};
