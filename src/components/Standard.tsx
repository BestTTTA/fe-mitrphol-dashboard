import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosSave } from "react-icons/io";
const StandardItemCard = ({ standardItem, index }) => {
  const [ndvi, setNDVI] = useState(standardItem.NDVI);
  const [ndwi, setNDWI] = useState(standardItem.NDWI);
  const [gli, setGLI] = useState(standardItem.GLI);
  const [precipitation, setPrecipitation] = useState(
    standardItem.Precipitation
  );
  const [soilmoiture, setSoilmoiture] = useState(standardItem.Soilmoiture);

  // State to track if we are in "edit" mode for each field
  const [isEditing, setIsEditing] = useState({
    ndvi: false,
    ndwi: false,
    gli: false,
    precipitation: false,
    soilmoiture: false,
  });

  async function updateStandard(attribute, value) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standard/${standardItem.ID}`,
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

      // After update, exit edit mode for the specific field
      setIsEditing((prevState) => ({
        ...prevState,
        [attribute]: false,
      }));
    } catch (error) {
      console.error("Error updating standard item:", error);
    }
  }

  return (
    <div key={index} className="flex w-full gap-4 justify-evenly">
      {/* NDVI */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
        <strong className="text-sky-400 font-bold">NDVI</strong>
        <div className="flex gap-1">
          {isEditing.ndvi ? (
            <input
              type="number"
              value={ndvi}
              onChange={(e) => setNDVI(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          ) : (
            <p className="ml-4">{ndvi}</p>
          )}
          {isEditing.ndvi ? (
            <button
              className="text-2xl"
              onClick={() => updateStandard("ndvi", ndvi)}
            >
            <IoIosSave size={30}/>
            </button>
          ) : (
            <button
              className="text-[18px]"
              onClick={() =>
                setIsEditing((prevState) => ({ ...prevState, ndvi: true }))
              }
            >
              <CiEdit size={20} />
            </button>
          )}
        </div>
      </div>

      {/* NDWI */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
        <strong className="text-sky-400 font-bold">NDWI</strong>
        <div className="flex gap-1">
          {isEditing.ndwi ? (
            <input
              type="number"
              value={ndwi}
              onChange={(e) => setNDWI(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          ) : (
            <p className="ml-4">{ndwi}</p>
          )}
          {isEditing.ndwi ? (
            <button
              className="text-2xl"
              onClick={() => updateStandard("ndwi", ndwi)}
            >
              <IoIosSave size={30}/>
            </button>
          ) : (
            <button
              className="text-[18px]"
              onClick={() =>
                setIsEditing((prevState) => ({ ...prevState, ndwi: true }))
              }
            >
              <CiEdit size={20} />
            </button>
          )}
        </div>
      </div>

      {/* GLI */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
        <strong className="text-sky-400 font-bold">GLI</strong>
        <div className="flex gap-1">
          {isEditing.gli ? (
            <input
              type="number"
              value={gli}
              onChange={(e) => setGLI(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          ) : (
            <p className="ml-4">{gli}</p>
          )}
          {isEditing.gli ? (
            <button
              className="text-2xl"
              onClick={() => updateStandard("gli", gli)}
            >
              <IoIosSave size={30}/>
            </button>
          ) : (
            <button
              className="text-[18px]"
              onClick={() =>
                setIsEditing((prevState) => ({ ...prevState, gli: true }))
              }
            >
              <CiEdit size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Precipitation */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
        <strong className="text-sky-400 font-bold">Precipitation</strong>
        <div className="flex gap-1">
          {isEditing.precipitation ? (
            <input
              type="number"
              value={precipitation}
              onChange={(e) => setPrecipitation(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          ) : (
            <p className="ml-4">{precipitation}</p>
          )}
          {isEditing.precipitation ? (
            <button
              className="text-2xl"
              onClick={() => updateStandard("precipitation", precipitation)}
            >
              <IoIosSave size={30}/>
            </button>
          ) : (
            <button
              className="text-[18px]"
              onClick={() =>
                setIsEditing((prevState) => ({ ...prevState, precipitation: true }))
              }
            >
              <CiEdit size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Soilmoisture */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-8 py-2 rounded-md shadow-sm">
        <strong className="text-sky-400 font-bold">Soilmoisture</strong>
        <div className="flex gap-1">
          {isEditing.soilmoiture ? (
            <input
              type="number"
              value={soilmoiture}
              onChange={(e) => setSoilmoiture(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          ) : (
            <p className="ml-4">{soilmoiture}</p>
          )}
          {isEditing.soilmoiture ? (
            <button
              className="text-2xl"
              onClick={() => updateStandard("soilmoiture", soilmoiture)}
            >
              <IoIosSave size={30}/>
            </button>
          ) : (
            <button
              className="text-[18px]"
              onClick={() =>
                setIsEditing((prevState) => ({ ...prevState, soilmoiture: true }))
              }
            >
              <CiEdit size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardItemCard;
