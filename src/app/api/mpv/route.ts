import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function fetchData() {
  const redisUrl = process.env.REDIS || 'redis://localhost:6379';

  const client = createClient({
    url: redisUrl, 
  });
  // const client = createClient();
  await client.connect();

  const cacheKey = "mpv_data";
  let data = await client.get(cacheKey);

  if (!data) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mpv/`, {
      next: { revalidate: 86400 },
    });
    const apiData = await response.json();

    await client.setEx(cacheKey, 86400, JSON.stringify(apiData));

    data = JSON.stringify(apiData);
  }

  await client.quit();
  return JSON.parse(data);
}

export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}
