"use client";
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

declare global {
  interface Window {
    google: any;
  }
}

function Map({
  data,
  standard,
  selectedFields,
  period,
}: {
  data: any[];
  standard: any[];
  selectedFields: string[];
  period: string;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<HTMLDivElement | null>(null);
  const [greaterCount, setGreaterCount] = useState(0);
  const [lessCount, setLessCount] = useState(0);
  const [equalCount, setEqualCount] = useState(0);

  const matchingStandard = standard.find(
    (std) =>
      std.StandardZone.trim().toLowerCase() === period.trim().toLowerCase()
  );

 
  useEffect(() => {
    if (!isLoaded || loadError) return;
  
    const initializeMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 15.87, lng: 100.9925 },
          zoom: 8,
          mapTypeId: "satellite",
        });
  
        let greater = 0;
        let less = 0;
        let equal = 0;
  
        data.forEach((item) => {
          const [lat, lon] = item.latLon.split("-").map(parseFloat);
  
          const cleanPeriod = period.trim().toLowerCase();
          const matchingStandard = standard.find(
            (std) => std.StandardZone.trim().toLowerCase() === cleanPeriod
          );
  
          let isGreaterThanStandard = false;
          let isLessThanStandard = false;
          let isEqualToStandard = true; // เริ่มต้นว่าเท่ากับมาตรฐาน
  
          if (matchingStandard) {
            // ตรวจสอบฟิลด์ทุกฟิลด์ใน selectedFields
            selectedFields.forEach((field) => {
              if (
                item[field] !== undefined &&
                matchingStandard[field] !== undefined
              ) {
                const itemValue = parseFloat(item[field]);
                const standardValue = parseFloat(matchingStandard[field]);
  
                // ถ้าค่ามากกว่ามาตรฐาน
                if (itemValue > standardValue) {
                  isGreaterThanStandard = true;
                  isEqualToStandard = false;
                }
                // ถ้าค่าน้อยกว่ามาตรฐาน
                else if (itemValue < standardValue) {
                  isLessThanStandard = true;
                  isEqualToStandard = false;
                }
              }
            });
          }
  
          // กำหนดสี marker ตามผลการเปรียบเทียบฟิลด์ทั้งหมด
          let color = "yellow"; // เริ่มต้นว่าเท่ากับมาตรฐาน
          if (isGreaterThanStandard && !isLessThanStandard) {
            color = "green"; // มีฟิลด์มากกว่ามาตรฐาน แต่ไม่มีฟิลด์น้อยกว่า
            greater++;
          } else if (isLessThanStandard) {
            color = "red"; // มีฟิลด์ที่น้อยกว่ามาตรฐาน
            less++;
          } else if (isEqualToStandard) {
            color = "yellow"; // เท่ากับมาตรฐาน
            equal++;
          }
  
          const marker = new window.google.maps.Marker({
            position: { lat, lng: lon },
            map,
            title: `Lat: ${lat}, Lon: ${lon}`,
            icon:
              color === "green"
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : color === "yellow"
                ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          });
  
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                ${selectedFields
                  .map((field) => `<p>${field}: ${item[field]}</p>`)
                  .join("")}
                <p style="padding: 10px; border-radius: 5px; font-weight: bold;">Lat: ${lat} | Lon: ${lon}</p>
              </div>
            `,
          });
  
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
  
        setGreaterCount(greater);
        setLessCount(less);
        setEqualCount(equal);
      }
    };
  
    initializeMap();
  }, [isLoaded, loadError, data, standard, selectedFields, period]);
  

  if (!isLoaded) return;
  <div className="flex w-full h-[600px] gap-4">
    <div className="w-[100%] h-full bg-sky-200 animate-pulse rounded-md"></div>
    <div className="w-[20%] h-full bg-sky-200 animate-pulse rounded-md"></div>
  </div>;
  if (loadError)
    return <div>Error loading Google Maps: {loadError.message}</div>;

  const total = greaterCount + lessCount + equalCount;
  const greaterPercentage =
    total > 0 ? ((greaterCount / total) * 100).toFixed(2) : 0;
  const lessPercentage = total > 0 ? ((lessCount / total) * 100).toFixed(2) : 0;
  const equalPercentage =
    total > 0 ? ((equalCount / total) * 100).toFixed(2) : 0;

  return (
    <div className="flex w-full h-full">
      <div className="w-full mt-3">
        <div ref={mapRef} style={{ width: "100%", height: "600px" }}  className="rounded-md shadow-md drop-shadow-sm"/>
      </div>
      <div className="w-[20%] p-4 flex flex-col items-center">
        <div className="w-full flex flex-col justify-center items-center p-2">
          <p className="text-sky-400 font-bold">Greater than standard</p>
          <p className="text-xl text-green-600 font-bold">
            {greaterPercentage}%
          </p>
          <p className="text-gray-400 text-sm font-bold">
            {greaterCount} Plantation
          </p>
        </div>
        <div className="bg-gray-700 h-[1px] w-[70%]"></div>
        <div className="w-full flex flex-col justify-center items-center p-2">
          <p className="text-sky-400 font-bold">Less than standard</p>
          <p className="text-xl text-red-600 font-bold">{lessPercentage}%</p>
          <p className="text-gray-400 text-sm font-bold">
            {lessCount} Plantation
          </p>
        </div>
        <div className="bg-gray-700 h-[1px] w-[70%]"></div>
        <div className="w-full flex flex-col justify-center items-center p-2">
          <p className="text-sky-400 font-bold">Equal to standard</p>
          <p className="text-xl text-yellow-600 font-bold">
            {equalPercentage}%
          </p>
          <p className="text-gray-400 text-sm font-bold">
            {equalCount} Plantation
          </p>
        </div>

        {matchingStandard ? (
          <div className="p-2">
            <p className="text-sky-600 font-bold mb-2">Standard Values</p>
            {selectedFields && selectedFields.length > 0 ? (
              selectedFields.map((field) => (
                <p key={field} className="flex justify-between">
                  <strong>{field}:</strong> {matchingStandard[field]}
                </p>
              ))
            ) : (
              <p>No fields selected.</p>
            )}
          </div>
        ) : (
          <p>No standard data available for this period.</p>
        )}
      </div>
    </div>
  );
}

export default Map;
