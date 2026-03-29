export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume-1.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume-2.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume-3.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
{
  "overallScore": number,
  "ATS": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string }
    ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  }
}
`;
export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  AIResponseFormat,
}: {
  jobTitle: string;
  jobDescription: string;
  AIResponseFormat: string;
}) =>
  `
You are an expert ATS resume reviewer.

Analyze the resume and return ONLY a valid JSON object.

IMPORTANT RULES:
- DO NOT return "rating"
- DO NOT return "analysis"
- DO NOT return explanations outside JSON
- DO NOT add backticks
- FOLLOW the exact structure below
- ALL scores must be between 0 and 100

Return EXACTLY this format:

${AIResponseFormat}

Guidelines:
- Give honest scores (low if bad)
- Each section MUST include:
  - score
  - 3–4 tips
- Tips must be concise but useful
- Use "good" or "improve" correctly

Job Title: ${jobTitle}
Job Description: ${jobDescription}
`;