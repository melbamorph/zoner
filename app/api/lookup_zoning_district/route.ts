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
  try {
    const body = await request.json();
    const { lat, lon } = body as Partial<LookupZoningRequest>;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return NextResponse.json(
        { error: "Both lat and lon must be numbers" },
        { status: 400 }
      );
    }

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Both lat and lon must be valid numbers" },
        { status: 400 }
      );
    }

    const arcgisUrl = new URL(
      "https://services8.arcgis.com/IS3r9gAO1V8yuCqO/ArcGIS/rest/services/OpenGov_Map_Service_WFL1/FeatureServer/0/query"
    );

    arcgisUrl.searchParams.set("geometry", `${lon},${lat}`);
    arcgisUrl.searchParams.set("geometryType", "esriGeometryPoint");
    arcgisUrl.searchParams.set("spatialRel", "esriSpatialRelIntersects");
    arcgisUrl.searchParams.set("outFields", "*");
    arcgisUrl.searchParams.set("returnGeometry", "false");
    arcgisUrl.searchParams.set("f", "json");

    const response = await fetch(arcgisUrl.toString());

    if (!response.ok) {
      return NextResponse.json(
        { error: `ArcGIS service returned status ${response.status}` },
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
