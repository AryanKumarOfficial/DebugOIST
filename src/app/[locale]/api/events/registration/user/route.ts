import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

// Mock database - simulated persistence using a variable
// In a real app, this would be a database connection
let registrationStore: { userId: string; eventId: string }[] = [];

// Mock database connection function
const connectToDatabase = async () => {
  // In a real implementation, this would connect to MongoDB
  return {
    db: {
      collection: (name: string) => ({
        find: (query: any) => ({
          toArray: async () => {
            console.log(`Mock find on ${name} with query:`, query);
            
            if (name === "eventRegistrations") {
              // Return filtered registrations for the user
              return registrationStore.filter(reg => reg.userId === query.userId);
            }
            
            return [];
          }
        }),
        findOne: async (query: any) => {
          console.log(`Mock findOne on ${name} with query:`, query);
          
          if (name === "eventRegistrations") {
            // Check if registration exists
            return registrationStore.find(
              reg => reg.userId === query.userId && reg.eventId === query.eventId?.toString()
            ) || null;
          }
          
          return null;
        },
        insertOne: async (doc: any) => {
          console.log(`Mock insertOne on ${name} with doc:`, doc);
          
          if (name === "eventRegistrations") {
            // Add to our mock store
            const newRegistration = {
              ...doc,
              eventId: doc.eventId.toString(),
              _id: new ObjectId()
            };
            
            registrationStore.push({
              userId: doc.userId,
              eventId: doc.eventId.toString()
            });
            
            return { insertedId: newRegistration._id };
          }
          
          return { insertedId: new ObjectId() };
        }
      }),
    },
  };
};

// GET /api/events/registration/user - Get user's registered events
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in to view your registrations" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find all event registrations for the user
    const registrations = await db.collection("eventRegistrations")
      .find({ userId })
      .toArray();
    
    // Extract event IDs
    const eventIds = registrations.length > 0 
      ? registrations.map((reg: any) => reg.eventId.toString()) 
      : [];
    
    return NextResponse.json({
      registeredEvents: eventIds
    });
    
  } catch (error) {
    console.error("Error fetching user's registered events:", error);
    return NextResponse.json(
      { error: "Failed to fetch registered events" },
      { status: 500 }
    );
  }
} 