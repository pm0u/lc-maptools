import { BottomRow } from "@/app/query/[lngLat]/query-card/bottom-row";
import { getFeatureName } from "@/lib/data";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import slugify from "slugify";

export const FeatureProperties = ({
  feature,
}: {
  feature: MapboxGeoJSONFeature;
}) => {
  return feature.properties ? (
    <div className="overflow-x-auto">
      <table className="table border-b border-b-base-200">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(feature.properties).map(([p, v]) => (
            <tr key={p} className="hover">
              <td>{p}</td>
              <td>{v}</td>
            </tr>
          ))}
          <BottomRow
            withTaxes={false}
            features={[feature]}
            exportName={slugify(getFeatureName(feature).toLocaleLowerCase(), {
              replacement: "_",
            })}
          />
        </tbody>
      </table>
    </div>
  ) : null;
};
