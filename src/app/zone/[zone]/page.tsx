"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Map from "@/components/Map";
import { usePathname } from "next/navigation";
import StandardItemCard from "@/components/Standard";
function SB() {
  const [parsedData, setParsedData] = useState<SBResponse | null>(null);
  const [standardData, setStandardData] = useState<StandardEntity[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Emergence");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "NDVI",
    "NDWI",
    "GLI",
    "Precipitation",
    "Soilmoiture",
  ]);
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const years = [2023, 2024];
  const periods = [
    { label: "Emergence", startMonth: 1, endMonth: 2 },
    { label: "Tillering", startMonth: 3, endMonth: 4 },
    { label: "StemElongation", startMonth: 6, endMonth: 9 },
    { label: "Maturity", startMonth: 10, endMonth: 12 },
  ];

  const pathname = usePathname();
  const zone = pathname.split("/").pop(); // Get the last part of the path

  // Fetch data only once when the component mounts
  useEffect(() => {
    async function loadData() {
      const response = await fetch(`/api/${zone}`);
      const data = await response.json();
      setParsedData(data);
    }

    if (!dataFetchedRef.current) {
      loadData();
      dataFetchedRef.current = true;
    }
  }, [zone]);

  useEffect(() => {
    async function loadStandardData() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/`
      );
      const data = await response.json();
      setStandardData(data.standard_entities);
    }

    if (!standardDataFetchedRef.current) {
      loadStandardData();
      standardDataFetchedRef.current = true;
    }
  }, []);

  const dataFetchedRef = useRef(false);
  const standardDataFetchedRef = useRef(false);

  const filteredData = parsedData
    ? parsedData[`${zone}_entities`].filter((item: SBEntity) => {
        const itemDate = new Date(item.Date);
        const year = itemDate.getFullYear();
        const month = itemDate.getMonth() + 1;

        const selectedPeriodObj = periods.find(
          (period) => period.label === selectedPeriod
        );

        if (!selectedPeriodObj) return false;

        return (
          year === selectedYear &&
          month >= selectedPeriodObj.startMonth &&
          month <= selectedPeriodObj.endMonth
        );
      })
    : [];

  const groupedData: { [key: string]: SBEntity[] } = filteredData.reduce(
    (acc, item) => {
      const key = `${item.Lat}-${item.Lon}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as { [key: string]: SBEntity[] }
  );

  const calculateAverages = useCallback((data: SBEntity[]) => {
    const sum = {
      NDVI: 0,
      NDWI: 0,
      GLI: 0,
      Precipitation: 0,
      Soilmoiture: 0,
    };

    const count = {
      NDVI: 0,
      NDWI: 0,
      GLI: 0,
      Precipitation: 0,
      Soilmoiture: 0,
    };

    data.forEach((item) => {
      if (item.NDVI) {
        sum.NDVI += parseFloat(item.NDVI.toString());
        count.NDVI += 1;
      }
      if (item.NDWI) {
        sum.NDWI += parseFloat(item.NDWI.toString());
        count.NDWI += 1;
      }
      if (item.GLI) {
        sum.GLI += parseFloat(item.GLI.toString());
        count.GLI += 1;
      }
      if (item.Precipitation) {
        sum.Precipitation += parseFloat(item.Precipitation.toString());
        count.Precipitation += 1;
      }
      if (item.Soilmoiture) {
        sum.Soilmoiture += parseFloat(item.Soilmoiture.toString());
        count.Soilmoiture += 1;
      }
    });

    return {
      NDVI: count.NDVI > 0 ? sum.NDVI / count.NDVI : 0,
      NDWI: count.NDWI > 0 ? sum.NDWI / count.NDWI : 0,
      GLI: count.GLI > 0 ? sum.GLI / count.GLI : 0,
      Precipitation:
        count.Precipitation > 0 ? sum.Precipitation / count.Precipitation : 0,
      Soilmoiture:
        count.Soilmoiture > 0 ? sum.Soilmoiture / count.Soilmoiture : 0,
    };
  }, []);

  const calculatedAverages = Object.keys(groupedData).map((key) => {
    const group = groupedData[key];
    const averageValues = calculateAverages(group);
    return {
      latLon: key,
      ...averageValues,
    };
  });

  const filteredStandard = standardData.filter((standard) => {
    return standard.StandardZone === selectedPeriod;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedFields([
        "NDVI",
        "NDWI",
        "GLI",
        "Precipitation",
        "Soilmoiture",
      ]);
    } else {
      setSelectedFields([]);
    }
  };

  const handleFieldSelect = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields((prev) => prev.filter((f) => f !== field));
    } else {
      setSelectedFields((prev) => [...prev, field]);
    }
  };



  return (
    <main className="w-full p-4">
      <h2 className="mt-4 mb-2 text-center font-bold text-sky-500 text-4xl">
        Standard
      </h2>
      {filteredStandard.length > 0 ? (
        filteredStandard.map((standardItem, index) => (
          <StandardItemCard key={index} standardItem={standardItem} index={index} />
        ))
      ) : (
        <p>Not found standard.</p>
      )}

      <div className="flex mt-8 gap-2">
        <label htmlFor="year">เลือกปี:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-md"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="period">เลือกช่วงเดือน:</label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border rounded-md"
        >
          {periods.map((period) => (
            <option key={period.label} value={period.label}>
              {period.label}
            </option>
          ))}
        </select>

        <label htmlFor="fields">เลือกค่าในการเปรียบเทียบ:</label>
        <div className="flex items-center">
          <div id="fields" className="flex items-center gap-2">
            {["NDVI", "NDWI", "GLI", "Precipitation", "Soilmoiture"].map(
              (field) => (
                <div key={field}>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldSelect(field)}
                  />
                  <label>{field}</label>
                </div>
              )
            )}
            <div>
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="select-all">เลือกทั้งหมด</label>
            </div>
          </div>
        </div>
      </div>
      <Map
        data={calculatedAverages}
        standard={filteredStandard}
        selectedFields={selectedFields}
        period={selectedPeriod}
      />
    </main>
  );
}

export default SB;

export interface SBEntity {
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
}

export interface SBResponse {
  sb_entities: SBEntity[];
}

export interface StandardEntity {
  StandardZone: string;
  NDVI: number;
  NDWI: number;
  GLI: number;
  Precipitation: number;
  Soilmoiture: number;
}
