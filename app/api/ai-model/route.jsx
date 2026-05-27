// import OpenAI from "openai";
// import { QUESTION_PROMPT } from "@/services/Constant";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     const { jobPosition, jobDescription, duration, type } = await req.json();
//     const Final_prompt = QUESTION_PROMPT.replace('{{jobTitle}}', jobPosition).replace('{{jobDescription}}', jobDescription).replace('{{type}}', type).replace('{{duration}}', duration)
//     console.log("Final_prompt: "+Final_prompt)
//     try {
//         const OPEN_ROUTER_API_KEY= process.env.API_KEY
//         const openai = new OpenAI({
//             apiKey: OPEN_ROUTER_API_KEY,
//             baseURL: "https://openrouter.ai/api/v1",
//         })
//         const completion = await openai.chat.completions.create({

//             // model: "${nvidia/llama-3.1-nemotron-ultra-253b-v1:free}",
//             model: "deepseek/deepseek-r1-0528-qwen3-8b:free",

//             messages: [
//                 { role: "user", content: Final_prompt }
//             ],
//             // response_format:'json'
//         })
//         console.log(completion.choices[0].message)
//         return NextResponse.json(completion.choices[0].message)
//     }
//     catch (e) {
//         console.log(e);
//         return NextResponse.json(e)
//     }
// }
import OpenAI from "openai";
import { QUESTION_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { jobPosition, jobDescription, duration, type } = await req.json();

        // Input validation
        if (!jobPosition?.trim()) {
            return NextResponse.json({ 
                error: "Job position is required." 
            }, { status: 400 });
        }
        if (!jobDescription?.trim()) {
            return NextResponse.json({ 
                error: "Job description is required." 
            }, { status: 400 });
        }
        if (!duration || isNaN(duration)) {
            return NextResponse.json({ 
                error: "Valid duration is required." 
            }, { status: 400 });
        }
        const interviewType = Array.isArray(type) ? type.join(", ") : type;
        if (!interviewType?.trim()) {
            return NextResponse.json({ 
                error: "Interview type is required." 
            }, { status: 400 });
        }

        const Final_prompt = QUESTION_PROMPT
            .replace('{{jobTitle}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{type}}', interviewType)
            .replace('{{duration}}', duration);

        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const completion = await openai.chat.completions.create({
            model: process.env.OPENROUTER_MODEL || "openrouter/free",
            messages: [{ role: "user", content: Final_prompt }],
        });

        if (!completion.choices[0]?.message?.content) {
            throw new Error("No content in API response");
        }

        const rawContent = completion.choices[0].message.content;
        const cleanedContent = rawContent
            .replace(/```json|```/g, '')
            .trim();

        const parsed = JSON.parse(cleanedContent);

        if (!parsed.interviewQuestions || !Array.isArray(parsed.interviewQuestions)) {
            throw new Error("Invalid response format: missing interviewQuestions array");
        }

        return NextResponse.json({ interviewQuestions: parsed.interviewQuestions });

    } catch (e) {
        console.error("AI Parse Error:", e.message);
        return NextResponse.json({ 
            error: "Failed to parse AI response.",
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        }, { status: 500 });
    }
}
