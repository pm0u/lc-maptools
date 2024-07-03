import type { GeoJsonProperties, Polygon, Geometry } from "geojson";

export const areaIds = [
  191, 112, 114, 193, 195, 196, 197, 198, 199, 189,
] as const;

export type AreaId = (typeof areaIds)[number];

export type AvailableLCMDProperties = {
  fid: number;
  objectid: number;
  accountnum: number;
  pashouse: number;
  laacres: number;
  tyler_act: string;
  parcelnumb: string;
  pin: string;
  accountno: string;
  /** ??? legal name without street address? */
  legal: string;
  shape__are: number;
  shape__len: number;
  accountn_1: string;
  nameaddrid: string;
  nametype: string;
  /** Owner name */
  name: string;
  careof: string;
  /** owner address line 1 */
  address1: string;
  /** owner address line 2 */
  address2: string;
  /** owner address city */
  city: string;
  /** owner address state */
  state: "co";
  /** owner address zip */
  zipcode: string;
  parcelnb: string;
  mhspace: string;
  parcelseq: number;
  areaid: AreaId;
  accttype: string;
  businessna: string;
  mapno: string;
  borderingc: string;
  bacode: string;
  lagent: string;
  /** number of plot address */
  streetno: string;
  extent: string;
  direction: string;
  /** street name of plot address */
  streetname: string;
  /** street designation eg ave, st, etc */
  designation: string;
  directions: string;
  suffix: string;
  unitnumber: string;
  /** city of plot address */
  loccity: string;
  /** ?? matches LEGAL ? */
  legal_1: string;
  aprdist: string;
  ba_owner_i: string;
  ba_locatio: string;
  landsqft: number;
  subcode: number;
  /** subdivision name of plot */
  subname: string;
  condocode: string;
  condoname: string;
  salep: number;
  saledt: number;
  docfee: number;
  deedtype: string;
  /** part of legal */
  block: string;
  /** lot no., part of legal */
  lot: string;
  condounit: string;
  book: string;
  page: string;
  reception_: string;
  /** mill levy rate? */
  mill_levy: number;
  classcd1: number;
  classcd1_d: string;
  classcd2: number;
  classcd2_d: string;
  classcd3: string;
  classcd3_d: string;
  classcd4: string;
  classcd4_d: string;
  classcd5: string;
  classcd5_d: string;
  /** tax year values are valid for? */
  taxyear: number;
  landact: number;
  impact: number;
  landasd: number;
  impasd: number;
  /** plot size? */
  acres: number;
  sqft: number;
  units: number;
  cur_tax: string;
  cur_fee: string;
  cur_int: string;
  cur_pay: string;
  cur_bal: string;
  lst_tax: string;
  lst_fee: string;
  lst_int: string;
  lst_pay: string;
  lst_bal: string;
  /** Value of plot? */
  actual_val: number;
  /** assessed value of plot? */
  assessed_v: number;
  shape__area: number;
  shape__length: number;
};

export type PublicLandAgency = "BLM" | "USFW" | "USFS";

export type AvailablePublicLandProperties = {
  adm_manage: PublicLandAgency;
  adm_code: string;
  gis_acres: number;
};

export type ExtendedGeoJson<
  AddtlProperties extends GeoJsonProperties = GeoJsonProperties,
  Geo extends Geometry = Polygon
> = GeoJSON.FeatureCollection<
  Geo,
  AvailableLCMDProperties & AddtlProperties
> & {
  id: string;
};

export type ExtendedLCMDGeoJson = ExtendedGeoJson<AvailableLCMDProperties>;

export type ArcGISResponse = GeoJSON.FeatureCollection<
  Polygon,
  AvailableLCMDProperties
> & {
  properties?: {
    exceededTransferLimit?: true;
  };
};
