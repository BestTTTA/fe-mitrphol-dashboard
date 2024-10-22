import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosSave } from "react-icons/io";
import { AiOutlineReload } from "react-icons/ai";

const defaultValues = {
  "StemElongation": { ndvi: 0.354788, ndwi: -0.30149, gli: -2920000, precipitation: 7.002696, soilmoiture: 0.63901 },
  "Emergence": { ndvi: 0.156771, ndwi: -0.187685, gli: -2650000, precipitation: 0.253079, soilmoiture: 0.511256 },
  "Maturity": { ndvi: 0.286034, ndwi: -0.240726, gli: -4390000, precipitation: 2.383508, soilmoiture: 0.711496 },
  "Tillering": { ndvi: 0.218021, ndwi: -0.221464, gli: -2770000, precipitation: 1.896649, soilmoiture: 0.464787 },
};

const EditableField = ({
  label,
  value,
  isEditing,
  onEditClick,
  onSaveClick,
  onChange,
  onResetClick,
}) => (
  <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
    <strong className="text-sky-400 font-bold">{label}</strong>
    <div className="flex gap-1">
      {isEditing ? (
        <input
          type="number"
          value={value}
          onChange={onChange}
          className="mt-2 p-2 border rounded"
        />
      ) : (
        <p className="ml-4">{value}</p>
      )}
      {isEditing ? (
        <button className="text-2xl" onClick={onSaveClick}>
          <IoIosSave size={30} />
        </button>
      ) : (
        <button className="text-[18px]" onClick={onEditClick}>
          <CiEdit size={20} />
        </button>
      )}
      <button className="text-[18px] ml-2" onClick={onResetClick}>
        <AiOutlineReload size={20} />
      </button>
    </div>
  </div>
);

const StandardItemCard = ({ standardItem, index }) => {
  const [id, setID] = useState(standardItem.ID);
  const [ndvi, setNDVI] = useState(standardItem.NDVI);
  const [ndwi, setNDWI] = useState(standardItem.NDWI);
  const [gli, setGLI] = useState(standardItem.GLI);
  const [precipitation, setPrecipitation] = useState(standardItem.Precipitation);
  const [soilmoisture, setSoilmoisture] = useState(standardItem.Soilmoiture);

  const [isEditing, setIsEditing] = useState({
    ndvi: false,
    ndwi: false,
    gli: false,
    precipitation: false,
    soilmoiture: false,
  });

  useEffect(() => {
    if (standardItem.length > 0) {
      const item = standardItem[0];
      setID(item.ID);
      setNDVI(item.NDVI);
      setNDWI(item.NDWI);
      setGLI(item.GLI);
      setPrecipitation(item.Precipitation);
      setSoilmoisture(item.Soilmoiture);
    }
  }, [standardItem]);

  async function updateStandard(attribute, value) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [attribute]: parseFloat(value),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      const updatedData = await response.json();
      console.log("Updated successfully", updatedData);

      setIsEditing((prevState) => ({
        ...prevState,
        [attribute.toLowerCase()]: false,
      }));
    } catch (error) {
      console.error("Error updating standard item:", error);
    }
  }

  async function resetToDefault(attribute) {
    console.log(attribute)
    // ตรวจสอบว่า standardItem มีข้อมูลและเป็น array
    if (!standardItem || !Array.isArray(standardItem) || standardItem.length === 0) {
      console.error("Invalid or missing standardItem:", standardItem);
      return;
    }
  
    // เข้าถึง StandardZone จาก standardItem[0]
    const standardZone = standardItem[0]?.StandardZone; 
    
    if (!standardZone || !defaultValues[standardZone]) {
      console.error(`Invalid or missing StandardZone: ${standardZone}`);
      return;
    }
  
    // ดึงค่า default ตาม StandardZone ที่ได้รับ
    const defaultValue = defaultValues[standardZone][attribute.toLowerCase()];
  
    switch (attribute.toLowerCase()) {
      case "ndvi":
        setNDVI(defaultValue);
        break;
      case "ndwi":
        setNDWI(defaultValue);
        break;
      case "gli":
        setGLI(defaultValue);
        break;
      case "precipitation":
        setPrecipitation(defaultValue);
        break;
      case "soilmoiture":
        setSoilmoisture(defaultValue);
        break;
      default:
        return;
    }
  
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/standard/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [attribute]: defaultValue,
        }),
      });
      console.log(`Reset ${attribute} to default for ${standardZone} successfully`);
    } catch (error) {
      console.error(`Error resetting ${attribute} to default:`, error);
    }
  }
  
  return (
    <div key={index} className="flex w-full gap-4 justify-evenly">
      <EditableField
        label="NDVI"
        value={ndvi}
        isEditing={isEditing.ndvi}
        onEditClick={() =>
          setIsEditing((prevState) => ({ ...prevState, ndvi: true }))
        }
        onSaveClick={() => updateStandard("NDVI", ndvi)}
        onChange={(e) => setNDVI(e.target.value)}
        onResetClick={() => resetToDefault("NDVI")}
      />
      <EditableField
        label="NDWI"
        value={ndwi}
        isEditing={isEditing.ndwi}
        onEditClick={() =>
          setIsEditing((prevState) => ({ ...prevState, ndwi: true }))
        }
        onSaveClick={() => updateStandard("NDWI", ndwi)}
        onChange={(e) => setNDWI(e.target.value)}
        onResetClick={() => resetToDefault("NDWI")}
      />
      <EditableField
        label="GLI"
        value={gli}
        isEditing={isEditing.gli}
        onEditClick={() =>
          setIsEditing((prevState) => ({ ...prevState, gli: true }))
        }
        onSaveClick={() => updateStandard("GLI", gli)}
        onChange={(e) => setGLI(e.target.value)}
        onResetClick={() => resetToDefault("GLI")}
      />
      <EditableField
        label="Precipitation"
        value={precipitation}
        isEditing={isEditing.precipitation}
        onEditClick={() =>
          setIsEditing((prevState) => ({ ...prevState, precipitation: true }))
        }
        onSaveClick={() => updateStandard("Precipitation", precipitation)}
        onChange={(e) => setPrecipitation(e.target.value)}
        onResetClick={() => resetToDefault("Precipitation")}
      />
      <EditableField
        label="Soilmoisture"
        value={soilmoisture}
        isEditing={isEditing.soilmoiture}
        onEditClick={() =>
          setIsEditing((prevState) => ({ ...prevState, soilmoiture: true }))
        }
        onSaveClick={() => updateStandard("Soilmoiture", soilmoisture)}
        onChange={(e) => setSoilmoisture(e.target.value)}
        onResetClick={() => resetToDefault("Soilmoiture")}
      />
    </div>
  );
};

export default StandardItemCard;
