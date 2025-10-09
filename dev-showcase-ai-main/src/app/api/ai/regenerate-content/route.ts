import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { aiContentService } from "@/lib/ai-content-service"
import { UserInputSchema } from "@/lib/ai-content-generator"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { portfolioId, updates } = body

    if (!portfolioId) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      )
    }

    // Validate updates using Zod schema (partial validation)
    const validatedUpdates = UserInputSchema.partial().parse(updates || {})

    // Regenerate content
    const result = await aiContentService.regenerateContent(
      session.user.id,
      portfolioId,
      validatedUpdates
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      metadata: result.metadata,
    })

  } catch (error) {
    console.error("Content regeneration API error:", error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
