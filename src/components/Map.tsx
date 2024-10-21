"use client";
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import * as XLSX from "xlsx";

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
          let isEqualToStandard = true;

          if (matchingStandard) {
            selectedFields.forEach((field) => {
              if (
                item[field] !== undefined &&
                matchingStandard[field] !== undefined
              ) {
                const itemValue = parseFloat(item[field]);
                const standardValue = parseFloat(matchingStandard[field]);

                if (itemValue > standardValue) {
                  isGreaterThanStandard = true;
                  isEqualToStandard = false;
                } else if (itemValue < standardValue) {
                  isLessThanStandard = true;
                  isEqualToStandard = false;
                }
              }
            });
          }

          let color = "yellow";
          if (isGreaterThanStandard && !isLessThanStandard) {
            color = "green";
            greater++;
          } else if (isLessThanStandard) {
            color = "red";
            less++;
          } else if (isEqualToStandard) {
            color = "yellow";
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

  const exportToExcel = () => {
    const wsData = data.map((item) => {
      const [lat, lon] = item.latLon.split("-");
      return {
        Lat: lat,
        Lon: lon,
        ...selectedFields.reduce((acc, field) => {
          acc[field] = item[field];
          return acc;
        }, {}),
      };
    });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Map Data");

    XLSX.writeFile(wb, "map_data.xlsx");
  };

  const exportLessData = () => {
    const lessData = data.filter((item) => {
      let isLessThanStandard = false;
  
      const matchingStandard = standard.find(
        (std) =>
          std.StandardZone.trim().toLowerCase() === period.trim().toLowerCase()
      );
  
      if (matchingStandard) {
        selectedFields.forEach((field) => {
          if (
            item[field] !== undefined &&
            matchingStandard[field] !== undefined
          ) {
            const itemValue = parseFloat(item[field]);
            const standardValue = parseFloat(matchingStandard[field]);
            if (itemValue < standardValue) {
              isLessThanStandard = true;
            }
          }
        });
      }
  
      return isLessThanStandard;
    });
  
    // Transform data to have separate Lat and Lon columns
    const transformedData = lessData.map((item) => {
      const [lat, lon] = item.latLon.split("-").map(parseFloat); // Split latLon into separate values
      return {
        Lat: lat, // Add Lat column
        Lon: lon, // Add Lon column
        ...selectedFields.reduce((acc, field) => {
          acc[field] = item[field]; // Include selected fields
          return acc;
        }, {}),
      };
    });
  
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Less Than Standard");
  
    XLSX.writeFile(wb, "less_than_standard.xlsx");
  };
  

  // New function to export data greater than the standard
const exportGreaterData = () => {
  const greaterData = data.filter((item) => {
    let allFieldsGreaterThanStandard = true;

    const matchingStandard = standard.find(
      (std) =>
        std.StandardZone.trim().toLowerCase() === period.trim().toLowerCase()
    );

    if (matchingStandard) {
      selectedFields.forEach((field) => {
        if (
          item[field] !== undefined &&
          matchingStandard[field] !== undefined
        ) {
          const itemValue = parseFloat(item[field]);
          const standardValue = parseFloat(matchingStandard[field]);

          // If any field is less than or equal to the standard, set flag to false
          if (itemValue <= standardValue) {
            allFieldsGreaterThanStandard = false;
          }
        }
      });
    }

    return allFieldsGreaterThanStandard; // Only include if all fields are greater
  });

  // Transform data to have separate Lat and Lon columns
  const transformedData = greaterData.map((item) => {
    const [lat, lon] = item.latLon.split("-").map(parseFloat); // Split latLon into separate values
    return {
      Lat: lat, // Add Lat column
      Lon: lon, // Add Lon column
      ...selectedFields.reduce((acc, field) => {
        acc[field] = item[field]; // Include selected fields
        return acc;
      }, {}),
    };
  });

  const ws = XLSX.utils.json_to_sheet(transformedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Greater Than Standard");

  XLSX.writeFile(wb, "greater_than_standard.xlsx");
};


  if (!isLoaded)
    return (
      <div className="flex w-full h-[600px] gap-4">
        <div className="w-[100%] h-full bg-sky-200 animate-pulse rounded-md"></div>
        <div className="w-[20%] h-full bg-sky-200 animate-pulse rounded-md"></div>
      </div>
    );
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
        <div
          ref={mapRef}
          style={{ width: "100%", height: "600px" }}
          className="rounded-md shadow-md drop-shadow-sm"
        />
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

        <div className="mt-4 flex flex-col gap-2">
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={exportToExcel}
          >
            Download All Data as Excel
          </button>

          <button
            className="p-2 bg-red-500 text-white rounded-md"
            onClick={exportLessData}
          >
            Download Less Than Standard
          </button>

          <button
            className="p-2 bg-green-500 text-white rounded-md"
            onClick={exportGreaterData}
          >
            Download Greater Than Standard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Map;
