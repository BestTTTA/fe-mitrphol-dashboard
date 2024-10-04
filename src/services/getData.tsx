const getData = async (zone: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${zone}/`,
    {
      next: {
        revalidate: 3600, 
      },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed fetch data");
  }

  const data = await response.json();
  return data;
};



export default getData;
