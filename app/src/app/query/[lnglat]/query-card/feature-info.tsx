import { MapboxGeoJSONFeature } from "mapbox-gl";

export const FeatureInfo = ({
  feature,
  className,
}: {
  feature: MapboxGeoJSONFeature;
  className?: string;
}) => {
  const { NAME, ...propertiesToDisplay } = feature.properties;
  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(propertiesToDisplay).map(([p, v]) => (
              <tr key={p} className="hover">
                <td>{p}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
