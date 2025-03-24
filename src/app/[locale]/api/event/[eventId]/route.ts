import Event from "@/src/Backend/Models/Event";
import connect from "@/src/Backend/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
    try {
        await connect();
        const { eventId } = params;
        if (!eventId) {
            return NextResponse.json({
                error: "Invalid Request",
                success: false
            }, {
                status: 400
            })
        }
        const event = await Event.findById(new ObjectId(eventId));
        if (!event) {
            return NextResponse.json({
                error: "Event Not Found",
                success: false
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            message: "Event Fetched!",
            success: true,
            event
        }, {
            status: 200
        })
    } catch (e: any) {
        console.log("Error Fetching the Event");
        return NextResponse.json({
            error: "Internal Server Error",
            success: false
        }, {
            status: 500
        })

    }
}