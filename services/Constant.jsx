import { Calendar, LayoutDashboard, List, WalletCards, Settings, BriefcaseBusinessIcon, Flag, Puzzle, User2Icon, Code2Icon } from "lucide-react";

export const SideBarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    },
    {
        name: 'Schedule Interview',
        icon: Calendar,
        path: '/schedule-interview'
    },
    {
        name: 'All Interview',
        icon: List,
        path: '/all-interview'
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/billing'
    },
    {
        name: 'Setting',
        icon: Settings,
        path: '/settings'
    },
]

export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioural',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Flag
    },
]

// export const QUESTION_PROMPT = `const PROMPT = You are an expert technical interviewer.
// Based on the following inputs, generate a well - structured list of high - quality interview questions:
// Job Title: {{jobTitle}}
// Job Description: {{jobDescription}}
// Interview Duration: {{duration}}
// Interview Type: {{type}}
// 📝 Your task:
// Analyze the job description to identify key responsibilities, required skills, and expected experience.
// Generate a list of interview questions depends on interview duration
// Adjust the number and depth of questions to match the interview duration.
// Ensure the questions match the tone and structure of a real - life { { type } } interview.
// ✂️ Format your response in JSON format with array list of questions.
//     format: interviewQuestions = [
//         {
//             question: "",
//             type: 'Technical/Behavioral/Experince/Problem Solving/Leaseship'
//         }, {
//             ...
// }]
// 🎯 The goal is to create a structured, relevant, and time - optimized interview plan for a {{ jobTitle }} role`

export const QUESTION_PROMPT = `
You are an expert technical interviewer.

Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}}  
Interview Type: {{type}}

📝 Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions based on the interview duration.
- Adjust the number and depth of questions to match the duration.
- Ensure the questions reflect the tone and structure of a real-life {{type}} interview.

✂️ Format your response strictly as a raw JSON object. Do **not** wrap the output in triple backticks or markdown.

Format:
{
  "interviewQuestions": [
    {
      "question": "What is your experience with designing scalable APIs?",
      "type": "Technical"
    },
    {
      "question": "Describe a time you had to resolve a team conflict.",
      "type": "Leadership"
    }
  ]
}

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`;


export const FEEDBACK_PROMT = `
If the conversation above is empty, missing, or contains no meaningful answers from the user, respond with the following JSON:

{
  "feedback": {
    "rating": null,
    "summary": "No interview was conducted.",
    "recommendation": "No",
    "recommendationMsg": "The candidate did not participate in the interview."
  }
}

Otherwise, based on the above interview conversation between the assistant and the user, provide structured feedback for the user's performance.

1. Give ratings out of 10 for the following categories:
   - Technical Skills
   - Communication
   - Problem Solving
   - Experience

2. Write a summary of the interview in 3 lines.

3. Clearly mention whether the user is recommended for hire or not, and include a one-line message justifying the recommendation.
Return the response strictly in the following JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": <number>,
      "communication": <number>,
      "problemSolving": <number>,
      "experience": <number>
    },
    "summary": "<3-line summary here>",
    "recommendation": "<Yes or No>",
    "recommendationMsg": "<One-line message>"
  }
}
`