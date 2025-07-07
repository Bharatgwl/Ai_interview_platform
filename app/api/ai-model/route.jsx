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
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const Final_prompt = QUESTION_PROMPT
        .replace('{{jobTitle}}', jobPosition)
        .replace('{{jobDescription}}', jobDescription)
        .replace('{{type}}', type)
        .replace('{{duration}}', duration);

    try {
        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [{ role: "user", content: Final_prompt }],
        });

        const rawContent = completion.choices[0].message.content;

        // 🧼 Clean the content: remove ```json and ```
        const cleanedContent = rawContent
            .replace(/```json|```/g, '')
            .trim();

        // ✅ Parse it safely
        const parsed = JSON.parse(cleanedContent);

        // ✅ Return only the questions array
        return NextResponse.json({ interviewQuestions: parsed.interviewQuestions });

    } catch (e) {
        console.error("AI Parse Error:", e.message);
        return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }
}
