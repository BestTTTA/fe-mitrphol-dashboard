import { createClient } from "redis";
import { NextResponse } from "next/server";

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
}

async function fetchData(zone: string) {
  const redisUrl = process.env.REDIS_URL;
  const client = createClient({ url: redisUrl });
  const cacheKey = `${zone}_data`;
  const fetchTimeout = 30000; 

  try {
    await client.connect();

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = (await Promise.race([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${zone}`, { cache: 'no-store' }),
      timeout(fetchTimeout),
    ])) as Response; 

    if (!response.ok) {
      throw new Error(`Failed to fetch data from external API: ${response.statusText}`);
    }

    const apiData = await response.json();

    await client.setEx(cacheKey, 86400, JSON.stringify(apiData));

    return apiData;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch or cache data: ${error.message}`);
  } finally {
    await client.quit();
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');

  if (!zone) {
    return NextResponse.json({ error: "Zone parameter is required" }, { status: 400 });
  }

  try {
    const data = await fetchData(zone);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
