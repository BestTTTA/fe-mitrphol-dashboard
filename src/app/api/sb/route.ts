import { createClient } from "redis";
import { NextResponse } from "next/server";

async function fetchData(zone: string) {
  const redisUrl = process.env.REDIS || 'redis://localhost:6379';

  const client = createClient({
    url: redisUrl,
  });

  await client.connect();

  const cacheKey = `${zone}_data`;
  let data = await client.get(cacheKey);

  if (!data) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${zone}/`, {
      next: { revalidate: 86400 },
    });
    const apiData = await response.json();

    await client.setEx(cacheKey, 86400, JSON.stringify(apiData));

    data = JSON.stringify(apiData); // Convert to string
  }

  await client.quit(); // Ensure Redis connection is closed
  return JSON.parse(data); // Return parsed JSON
}

// API route handler
export async function GET(req: Request) {
  try {
    // Extracting zone from the request URL
    const url = new URL(req.url);
    const zone = url.pathname.split("/").pop(); // Get the last part of the path

    if (!zone) {
      return NextResponse.json({ error: "Zone not specified" }, { status: 400 });
    }

    const data = await fetchData(zone);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
