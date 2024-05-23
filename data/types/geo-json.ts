import type { GeoJsonProperties, Polygon, Geometry } from "geojson";

export type LCMDProperties = {
  FID: number;
  OBJECTID: number;
  AccountNum: number;
  PASHOUSE: number;
  LAACRES: number;
  Tyler_Act: string;
  ParcelNumb: string;
  PIN: string;
  ACCOUNTNO: string;
  /** ??? legal name without street address? */
  LEGAL: string;
  Shape__Are: number;
  Shape__Len: number;
  ACCOUNTN_1: string;
  NAMEADDRID: string;
  NAMETYPE: string;
  /** Owner name */
  NAME: string;
  CAREOF: string;
  /** owner address line 1 */
  ADDRESS1: string;
  /** owner address line 2 */
  ADDRESS2: string;
  /** owner address city */
  CITY: string;
  /** owner address state */
  STATE: "CO";
  /** owner address zip */
  ZIPCODE: string;
  PARCELNB: string;
  MHSPACE: string;
  PARCELSEQ: number;
  AREAID: number;
  ACCTTYPE: string;
  BUSINESSNA: string;
  MAPNO: string;
  BORDERINGC: string;
  BACODE: string;
  LAGENT: string;
  /** number of plot address */
  STREETNO: string;
  EXTENT: string;
  DIRECTION: string;
  /** street name of plot address */
  STREETNAME: string;
  /** street designation eg ave, st, etc */
  DESIGNATIO: string;
  DIRECTIONS: string;
  SUFFIX: string;
  UNITNUMBER: string;
  /** city of plot address */
  LOCCITY: string;
  /** ?? matches LEGAL ? */
  LEGAL_1: string;
  APRDIST: string;
  BA_OWNER_I: string;
  BA_LOCATIO: string;
  LANDSQFT: number;
  SUBCODE: number;
  /** subdivision name of plot */
  SUBNAME: string;
  CONDOCODE: string;
  CONDONAME: string;
  SALEP: number;
  SALEDT: number;
  DOCFEE: number;
  DEEDTYPE: string;
  /** part of legal */
  BLOCK: string;
  /** lot no., part of legal */
  LOT: string;
  CONDOUNIT: string;
  BOOK: string;
  PAGE: string;
  RECEPTION_: string;
  /** mill levy rate? */
  MILL_LEVY: number;
  CLASSCD1: number;
  CLASSCD1_D: string;
  CLASSCD2: number;
  CLASSCD2_D: string;
  CLASSCD3: string;
  CLASSCD3_D: string;
  CLASSCD4: string;
  CLASSCD4_D: string;
  CLASSCD5: string;
  CLASSCD5_D: string;
  /** tax year values are valid for? */
  TAXYEAR: number;
  LANDACT: number;
  IMPACT: number;
  LANDASD: number;
  IMPASD: number;
  /** plot size? */
  ACRES: number;
  SQFT: number;
  UNITS: number;
  CUR_TAX: string;
  CUR_FEE: string;
  CUR_INT: string;
  CUR_PAY: string;
  CUR_BAL: string;
  LST_TAX: string;
  LST_FEE: string;
  LST_INT: string;
  LST_PAY: string;
  LST_BAL: string;
  /** Value of plot? */
  ACTUAL_VAL: number;
  /** assessed value of plot? */
  ASSESSED_V: number;
  Shape__Area: number;
  Shape__Length: number;
};

export type ExtendedGeoJson<
  AddtlProperties extends GeoJsonProperties = GeoJsonProperties,
  Geo extends Geometry = Polygon
> = GeoJSON.FeatureCollection<Geo, LCMDProperties & AddtlProperties> & {
  id: string;
};

export type ExtendedLCMDGeoJson = ExtendedGeoJson<LCMDProperties>;

export type ArcGISResponse = GeoJSON.FeatureCollection<
  Polygon,
  LCMDProperties
> & {
  properties?: {
    exceededTransferLimit?: true;
  };
};

export type StyledExtendedGeoJson = ExtendedGeoJson<StyleProperties, Polygon>;

type StyleProperties = Record<StylePropertiesKeys, string>;

type StylePropertiesKeys = "fill-color" | "fill-opacity" | "fill-outline-color";

export type StyledLayer = StyledExtendedGeoJson["features"][number] & {
  id: string;
};

export type StyledLayers = StyledLayer[];
