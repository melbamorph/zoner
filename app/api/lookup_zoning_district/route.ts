import { NextRequest, NextResponse } from "next/server";

interface LookupZoningRequest {
  lat: number;
  lon: number;
}

interface ArcGISFeature {
  attributes: Record<string, unknown>;
}

interface ArcGISResponse {
  features?: ArcGISFeature[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    const { lat, lon } = body as Partial<LookupZoningRequest>;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return NextResponse.json(
        { error: "Both lat and lon must be valid numbers" },
        { status: 400 }
      );
    }

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Both lat and lon must be valid numbers" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90, longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    const arcgisUrl = new URL(
      "https://services8.arcgis.com/IS3r9gAO1V8yuCqO/ArcGIS/rest/services/OpenGov_Map_Service_WFL1/FeatureServer/0/query"
    );

    const geometryParam = JSON.stringify({
      x: lon,
      y: lat,
      spatialReference: { wkid: 4326 }
    });

    arcgisUrl.searchParams.set("geometry", geometryParam);
    arcgisUrl.searchParams.set("geometryType", "esriGeometryPoint");
    arcgisUrl.searchParams.set("inSR", "4326");
    arcgisUrl.searchParams.set("spatialRel", "esriSpatialRelIntersects");
    arcgisUrl.searchParams.set("outFields", "*");
    arcgisUrl.searchParams.set("returnGeometry", "false");
    arcgisUrl.searchParams.set("where", "1=1");
    arcgisUrl.searchParams.set("f", "json");

    const response = await fetch(arcgisUrl.toString());

    if (!response.ok) {
      return NextResponse.json(
        { error: "ArcGIS service error" },
        { status: 500 }
      );
    }

    const data = (await response.json()) as ArcGISResponse;

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const districtName =
        (feature.attributes.ZONING as string) ||
        (feature.attributes.NAME as string) ||
        (feature.attributes.name as string) ||
        "Unknown";

      return NextResponse.json({
        found: true,
        district: districtName,
        attributes: feature.attributes,
      });
    } else {
      return NextResponse.json({
        found: false,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
