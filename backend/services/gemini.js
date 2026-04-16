const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

/**
 * Analyze resume text and extract structured data
 */
async function analyzeResume(resumeText) {
  const prompt = `You are a career advisor analyzing a resume. Extract the following from the resume text and return ONLY valid JSON.

Resume:
"""
${resumeText}
"""

Return this exact JSON structure:
{
  "skills": ["list of technical and soft skills found"],
  "experienceLevel": "student | junior | mid | senior",
  "background": "1-2 sentence summary of their background",
  "education": "highest degree and field",
  "targetRoles": [
    {
      "rank": 1,
      "title": "Most fitting job title based on resume",
      "field": "Electrical Engineering | Computer Engineering | Computer Science",
      "reasoning": "Why this role fits their profile"
    },
    {
      "rank": 2,
      "title": "Second fitting job title",
      "field": "Electrical Engineering | Computer Engineering | Computer Science",
      "reasoning": "Why this role fits their profile"
    },
    {
      "rank": 3,
      "title": "Third fitting job title",
      "field": "Electrical Engineering | Computer Engineering | Computer Science",
      "reasoning": "Why this role fits their profile"
    }
  ],
  "identifiedGaps": ["skills or knowledge areas missing for these roles"]
}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    throw err
  }
}

/**
 * Generate learning topics for a given career path and available time
 */
async function generateLearningTopics({ careerPath, skills, gaps, experienceLevel, availableMinutes, sourceType }) {
  const prompt = `You are a personalized learning advisor. Generate learning topics for someone with the following profile:

Career Path Goal: ${careerPath}
Current Skills: ${skills.join(', ')}
Identified Gaps: ${gaps.join(', ')}
Experience Level: ${experienceLevel}
Available Time: ${availableMinutes} minutes
Preferred Source Type: ${sourceType} (video | text | both)

Return ONLY valid JSON with this structure:
{
  "topics": [
    {
      "title": "Topic name",
      "reasoning": "Why this topic is important for their career path",
      "difficulty": "beginner | intermediate | advanced",
      "estimatedMinutes": <number fitting within available time>,
      "searchQuery": "exact search query to find good resources for this topic"
    }
  ]
}

Rules:
- Return 3-5 topics that fit within the available time total
- Topics should directly address identified gaps
- Match difficulty to experience level
- searchQuery should be specific enough to find quality free resources`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    throw err
  }
}

module.exports = { analyzeResume, generateLearningTopics }
