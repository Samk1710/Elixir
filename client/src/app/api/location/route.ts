import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Location from '@/models/location';
import calculateDistance from '@/lib/calculateDistance';

export async function POST(req: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) { 
      await mongoose.connect(process.env.MONGODB_URI!); 
    }
    const body = await req.json();
    const requiredFields = ['id', 'location', 'name'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    const locationFields = ['latitude', 'longitude'];
    const missingLocationFields = locationFields.filter(field => !body.location[field]);
    if (missingLocationFields.length > 0) {
      return NextResponse.json(
        { error: `Missing location fields: ${missingLocationFields.join(', ')}` },
        { status: 400 }
      );
    }
    const { latitude, longitude } = body.location;
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Both latitude and longitude are required' },
        { status: 400 }
      );
    }
    const newLocation = new Location(body);
    const savedLocation = await newLocation.save();
    return NextResponse.json(
      {
        message: 'Location created successfully',
        data: savedLocation
      },
      { status: 201 }
    );

  } catch (error) {
   if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    console.error('Location creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





export async function GET(req: NextRequest) {
  try {
   
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const searchParams = req.nextUrl.searchParams;
    const latitude = parseFloat(searchParams.get('lat') || '');
    const longitude = parseFloat(searchParams.get('lng') || '');
    const rangeInKm = parseFloat(searchParams.get('range') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const locations = await Location.find({})
      .lean()
      .skip(skip)
      .limit(limit);

    const locationsWithDistance = locations
      .map(location => {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.location.latitude,
          location.location.longitude
        );
        return {
          ...location,
          distance: parseFloat(distance.toFixed(2))
        };
      })
      .filter(location => location.distance <= rangeInKm)
      .sort((a, b) => a.distance - b.distance);

    const totalLocations = await Location.countDocuments({});
    const totalPages = Math.ceil(totalLocations / limit);

    return NextResponse.json({
      status: 'success',
      data: {
        locations: locationsWithDistance,
        pagination: {
          total: totalLocations,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
