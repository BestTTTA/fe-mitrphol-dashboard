import { createClient } from "redis";
import { NextResponse } from "next/server";

// Move fetchData to be an internal function
async function fetchData() {
  const redisUrl = process.env.REDIS || 'redis://localhost:6379';

  const client = createClient({
    url: redisUrl, 
  });

  await client.connect();

  const cacheKey = "sb_data";
  let data = await client.get(cacheKey);

  if (!data) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sb/`, {
      next: { revalidate: 86400 },
    });
    const apiData = await response.json();

    await client.setEx(cacheKey, 86400, JSON.stringify(apiData));

    data = JSON.stringify(apiData);
  }

  await client.quit();
  return JSON.parse(data);
}

// Export only the HTTP handler (GET in this case)
export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}
