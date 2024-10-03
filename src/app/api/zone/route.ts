import { createClient } from "redis";
import { NextResponse } from "next/server";

// Helper function to create a timeout for fetch
function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
}

// Fetch data from Redis or external API and cache it
async function fetchData(zone: string) {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = createClient({ url: redisUrl });
  const cacheKey = `${zone}_data`;
  const fetchTimeout = 60000; // Set timeout to 5 seconds

  try {
    // Connect to Redis
    await client.connect();

    // Try to retrieve data from Redis cache
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch data from external API with timeout
    const response = (await Promise.race([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${zone}`, { cache: 'no-store' }),
      timeout(fetchTimeout),
    ])) as Response; // <-- Type assertion

    if (!response.ok) {
      throw new Error(`Failed to fetch data from external API: ${response.statusText}`);
    }

    const apiData = await response.json();

    // Store the fetched data in Redis with expiration (86400 seconds = 24 hours)
    await client.setEx(cacheKey, 86400, JSON.stringify(apiData));

    return apiData;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch or cache data: ${error.message}`);
  } finally {
    // Ensure Redis client disconnects properly
    await client.quit();
  }
}


// API Route handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');

  if (!zone) {
    return NextResponse.json({ error: "Zone parameter is required" }, { status: 400 });
  }

  try {
    // Fetch data using the fetchData function
    const data = await fetchData(zone);
    return NextResponse.json(data);
  } catch (error: any) {
    // Return error if fetching fails
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
