import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

// Mock database - simulated persistence using a variable
// In a real app, this would be a database connection
// Importing from user route would be better in a real app
let registrationStore: { userId: string; eventId: string }[] = [];

// Define types for our mock data
type MockEvent = {
  _id: any;
  title: string;
  status: string;
};

// Mock database connection function
const connectToDatabase = async () => {
  // In a real implementation, this would connect to MongoDB
  return {
    db: {
      collection: (name: string) => ({
        findOne: async (query: any) => {
          console.log(`Mock findOne on ${name} with query:`, query);
          
          if (name === "events" && query._id) {
            // Mock event data
            const mockEvent: MockEvent = {
              _id: query._id,
              title: "Mock Event",
              status: "upcoming",
              // Add other event fields as needed
            };
            return mockEvent;
          }
          
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

// POST /api/events/registration - Register for an event
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();
    const userId = session.userId;
    const user = await currentUser();
    
    // Check if user is authenticated
    if (!userId || !user) {
      return NextResponse.json(
        { error: "Authentication required to register for events" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    const { eventId } = data;
    
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if event exists
    const event = await db.collection("events").findOne({ 
      _id: new ObjectId(eventId) 
    }) as MockEvent | null;
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    
    // Check if event is completed
    if (event.status === "completed") {
      return NextResponse.json(
        { error: "Cannot register for a completed event" },
        { status: 400 }
      );
    }
    
    // Check if already registered
    const existingRegistration = await db.collection("eventRegistrations").findOne({
      eventId: new ObjectId(eventId),
      userId
    });
    
    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }
    
    // Create registration
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const userName = `${firstName} ${lastName}`.trim() || 'Anonymous User';
    const userEmail = user.emailAddresses && user.emailAddresses.length > 0 
      ? user.emailAddresses[0].emailAddress || '' 
      : '';
    
    const result = await db.collection("eventRegistrations").insertOne({
      eventId: new ObjectId(eventId),
      userId,
      userName,
      userEmail,
      registeredAt: new Date()
    });
    
    return NextResponse.json({
      message: "Successfully registered for the event",
      registrationId: result.insertedId.toString()
    });
    
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register for event" },
      { status: 500 }
    );
  }
} 