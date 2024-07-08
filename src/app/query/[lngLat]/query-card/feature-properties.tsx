import { BottomRow } from "@/app/query/[lngLat]/query-card/bottom-row";
import { TaxValue } from "@/app/query/[lngLat]/query-card/tax-value";
import { getFeatureName } from "@/lib/data";
import { isLCMDParcel } from "@/types/features";
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
      {isLCMDParcel(feature) ? <TaxValue feature={feature} /> : null}
    </div>
  ) : null;
};
