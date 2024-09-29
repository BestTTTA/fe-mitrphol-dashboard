export type Response = {
    ID: number;
    NDVI: number;
    NDWI: number;
    GLI: number;
    Precipitation: number;
    Soilmoiture: number;
    GeoWGS84: string;
    Lat: number;
    Lon: number;
    Date: string;
    mac_entities: Array<{
      ID: number;
      NDVI: number;
      NDWI: number;
      GLI: number;
      Precipitation: number;
      Soilmoiture: number;
      GeoWGS84: string;
      Lat: number;
      Lon: number;
      Date: string;
    }>;
  };