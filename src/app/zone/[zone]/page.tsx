"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Map from "../../../components/Map";
import { usePathname } from "next/navigation";
import StandardItemCard from "@/components/Standard";
import Link from "next/link";

function Zone() {
  const [parsedData, setParsedData] = useState<Response | null>(null);
  const [standardData, setStandardData] = useState<StandardEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [standardLoading, setStandardLoading] = useState<boolean>(true);
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
  const zone = pathname.split("/").pop();

  const dataFetchedRef = useRef(false);
  const standardDataFetchedRef = useRef(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/zone?zone=${zone}`);
        const data = await response.json();
        setParsedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!dataFetchedRef.current && zone) {
      setLoading(true);
      loadData();
      dataFetchedRef.current = true;
    }
  }, [zone]);

  useEffect(() => {
    async function loadStandardData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/standard/`
        );
        const data = await response.json();
        setStandardData(data.standard_entities);
      } catch (error) {
        console.error("Error fetching standard data:", error);
      } finally {
        setStandardLoading(false);
      }
    }

    if (!standardDataFetchedRef.current) {
      setStandardLoading(true);
      loadStandardData();
      standardDataFetchedRef.current = true;
    }
  }, []);

  const filteredData = parsedData
    ? parsedData[`${zone}_entities`].filter((item: Entity) => {
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

  const groupedData: { [key: string]: Entity[] } = filteredData.reduce(
    (acc, item) => {
      const key = `${item.Lat}-${item.Lon}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as { [key: string]: Entity[] }
  );

  const calculateAverages = useCallback((data: Entity[]) => {
    const sum: { [key: string]: number } = {
      NDVI: 0,
      NDWI: 0,
      GLI: 0,
      Precipitation: 0,
      Soilmoiture: 0,
    };
  
    const count: { [key: string]: number } = {
      NDVI: 0,
      NDWI: 0,
      GLI: 0,
      Precipitation: 0,
      Soilmoiture: 0,
    };
  
    data.forEach((item) => {
      // ตรวจสอบค่าที่ถูกเลือกใน selectedFields และคำนวณเฉพาะค่าที่ถูกเลือก
      if (selectedFields.includes("NDVI") && item.NDVI) {
        sum.NDVI += parseFloat(item.NDVI.toString());
        count.NDVI += 1;
      }
      if (selectedFields.includes("NDWI") && item.NDWI) {
        sum.NDWI += parseFloat(item.NDWI.toString());
        count.NDWI += 1;
      }
      if (selectedFields.includes("GLI") && item.GLI) {
        sum.GLI += parseFloat(item.GLI.toString());
        count.GLI += 1;
      }
      if (selectedFields.includes("Precipitation") && item.Precipitation) {
        sum.Precipitation += parseFloat(item.Precipitation.toString());
        count.Precipitation += 1;
      }
      if (selectedFields.includes("Soilmoiture") && item.Soilmoiture) {
        sum.Soilmoiture += parseFloat(item.Soilmoiture.toString());
        count.Soilmoiture += 1;
      }
    });
  
    // คืนค่าเฉลี่ยเฉพาะค่าที่ถูกเลือก
    return {
      NDVI: count.NDVI > 0 ? sum.NDVI / count.NDVI : 0,
      NDWI: count.NDWI > 0 ? sum.NDWI / count.NDWI : 0,
      GLI: count.GLI > 0 ? sum.GLI / count.GLI : 0,
      Precipitation: count.Precipitation > 0 ? sum.Precipitation / count.Precipitation : 0,
      Soilmoiture: count.Soilmoiture > 0 ? sum.Soilmoiture / count.Soilmoiture : 0,
    };
  }, [selectedFields]); // เพิ่ม selectedFields เข้าไปใน dependency array
  

  const calculatedAverages = Object.keys(groupedData).map((key) => {
    const group = groupedData[key];
    const averageValues = calculateAverages(group); // ส่งผ่านข้อมูลที่ถูกคำนวณค่าเฉลี่ย
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
    setSelectedFields((prevFields) => {
      if (prevFields.includes(field)) {
        return prevFields.filter((f) => f !== field);
      } else {
        return [...prevFields, field]; 
      }
    });
  };
  

  return (
    <main className="w-full p-4">
      <h2 className="mt-4 mb-2 text-center font-bold text-sky-500 text-4xl">
        Standard
      </h2>

      {standardLoading ? (
        <p>Loading standard data...</p>
      ) : filteredStandard.length > 0 ? (
        filteredStandard.map((standardItem, index) => (
          <StandardItemCard
            key={index}
            standardItem={filteredStandard}
            index={index}
          />
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
              <label htmlFor="select-all">เลือกทั้งหมด | </label>
            </div>
            <Link href="https://mitrphol-dashboard.ml.thetigerteamacademy.net" className="underline hover:text-sky-500">
              แสดงผลในรูปแบบ Prediction
            </Link>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex w-full h-[700px] gap-4">
          <div className="w-[100%] h-full bg-sky-200 animate-pulse rounded-md flex justify-center items-center">
            <p className="text-2xl text-sky-600">กำลังเตรียมพร้อมข้อมูล...</p>
          </div>
          <div className="w-[20%] h-full bg-sky-200 animate-pulse rounded-md"></div>
        </div>
      ) : (
        <Map
          data={calculatedAverages}
          standard={filteredStandard}
          selectedFields={selectedFields}
          period={selectedPeriod}
        />
      )}
    </main>
  );
}

export default Zone;

export interface Entity {
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

export interface Response {
  sb_entities: Entity[];
}

export interface StandardEntity {
  StandardZone: string;
  NDVI: number;
  NDWI: number;
  GLI: number;
  Precipitation: number;
  Soilmoiture: number;
}
