/**
 * Rule-based resume analysis (no AI needed)
 * Extracts skills and infers career paths based on keywords
 */

const SKILL_KEYWORDS = {
  'python': ['python', 'py'],
  'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
  'java': ['java'],
  'c++': ['c++', 'cpp'],
  'c#': ['c#', 'csharp', '.net'],
  'sql': ['sql', 'mysql', 'postgres', 'database'],
  'web': ['html', 'css', 'web', 'frontend', 'backend'],
  'machine learning': ['ml', 'machine learning', 'tensorflow', 'pytorch', 'keras'],
  'data science': ['data science', 'pandas', 'numpy', 'scikit'],
  'devops': ['docker', 'kubernetes', 'devops', 'ci/cd', 'jenkins'],
  'cloud': ['aws', 'azure', 'gcp', 'cloud'],
  'embedded': ['embedded', 'microcontroller', 'arduino', 'rtos'],
  'fpga': ['fpga', 'vhdl', 'verilog'],
  'circuit': ['circuit', 'electronics', 'pcb'],
  'signal processing': ['signal', 'dsp', 'fourier'],
  'control systems': ['control', 'pid', 'feedback'],
  'networking': ['network', 'tcp', 'ip', 'routing'],
  'security': ['security', 'cryptography', 'encryption'],
  'git': ['git', 'github', 'gitlab'],
  'linux': ['linux', 'unix', 'bash', 'shell']
}

const CAREER_PATHS = {
  'Electrical Engineering': {
    keywords: ['circuit', 'embedded', 'fpga', 'signal', 'control', 'electronics', 'power'],
    gaps: ['FPGA', 'Signal Processing', 'Control Systems', 'Power Electronics']
  },
  'Computer Engineering': {
    keywords: ['embedded', 'fpga', 'microcontroller', 'hardware', 'architecture', 'assembly'],
    gaps: ['Embedded Systems', 'FPGA Design', 'Computer Architecture', 'Real-time Systems']
  },
  'Computer Science': {
    keywords: ['python', 'javascript', 'java', 'machine learning', 'data science', 'web', 'devops', 'cloud'],
    gaps: ['Machine Learning', 'Distributed Systems', 'Advanced Algorithms', 'Cloud Architecture']
  }
}

function extractSkills(text) {
  const lower = text.toLowerCase()
  const skills = new Set()
  
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        skills.add(skill)
        break
      }
    }
  }
  
  return Array.from(skills)
}

function inferExperienceLevel(text) {
  const lower = text.toLowerCase()
  
  if (lower.includes('phd') || lower.includes('senior') || lower.includes('lead') || lower.includes('architect')) {
    return 'senior'
  }
  if (lower.includes('master') || lower.includes('mid-level') || lower.includes('3+ years') || lower.includes('5+ years')) {
    return 'mid'
  }
  if (lower.includes('junior') || lower.includes('1-2 years') || lower.includes('entry')) {
    return 'junior'
  }
  if (lower.includes('student') || lower.includes('bootcamp') || lower.includes('graduate')) {
    return 'student'
  }
  
  return 'junior' // default
}

function inferCareerPaths(text, skills) {
  const lower = text.toLowerCase()
  const scores = {}
  
  for (const [path, config] of Object.entries(CAREER_PATHS)) {
    let score = 0
    for (const kw of config.keywords) {
      if (lower.includes(kw)) score += 2
    }
    for (const skill of skills) {
      if (config.keywords.some(kw => skill.toLowerCase().includes(kw))) score += 1
    }
    scores[path] = score
  }
  
  // Sort by score and return top 3
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  
  return sorted.map(([path, _], idx) => ({
    rank: idx + 1,
    title: path === 'Electrical Engineering' ? 'Electrical Engineer' :
           path === 'Computer Engineering' ? 'Embedded Systems Engineer' :
           'Software Engineer',
    field: path,
    reasoning: `Based on your resume, ${path} aligns well with your skills and experience.`
  }))
}

function identifyGaps(skills, careerPaths) {
  if (!careerPaths || careerPaths.length === 0) return []
  
  const topPath = careerPaths[0].field
  const config = CAREER_PATHS[topPath]
  
  return config.gaps.filter(gap => 
    !skills.some(s => s.toLowerCase().includes(gap.toLowerCase()))
  )
}

/**
 * Analyze resume text and extract structured data (rule-based, no AI)
 */
async function analyzeResume(resumeText) {
  const skills = extractSkills(resumeText)
  const experienceLevel = inferExperienceLevel(resumeText)
  const targetRoles = inferCareerPaths(resumeText, skills)
  const identifiedGaps = identifyGaps(skills, targetRoles)
  
  return {
    skills: skills.length > 0 ? skills : ['General Technical Skills'],
    experienceLevel,
    background: `Professional with ${experienceLevel} level experience in ${skills.slice(0, 2).join(' and ')}.`,
    education: 'Degree in related field',
    targetRoles,
    identifiedGaps: identifiedGaps.length > 0 ? identifiedGaps : ['Advanced Topics']
  }
}

/**
 * Generate learning topics (rule-based, no AI)
 */
async function generateLearningTopics({ careerPath, skills, gaps, experienceLevel, availableMinutes, sourceType }) {
  const topics = []
  
  // Map gaps to topics
  const gapTopics = {
    'FPGA': { title: 'FPGA Design with Verilog', difficulty: 'advanced', minutes: 60 },
    'Signal Processing': { title: 'Digital Signal Processing Fundamentals', difficulty: 'intermediate', minutes: 45 },
    'Control Systems': { title: 'PID Control Systems', difficulty: 'intermediate', minutes: 40 },
    'Power Electronics': { title: 'Power Electronics Basics', difficulty: 'intermediate', minutes: 50 },
    'Embedded Systems': { title: 'Embedded Systems Programming', difficulty: 'intermediate', minutes: 45 },
    'Computer Architecture': { title: 'Computer Architecture & Organization', difficulty: 'intermediate', minutes: 50 },
    'Real-time Systems': { title: 'Real-time Operating Systems', difficulty: 'advanced', minutes: 60 },
    'Machine Learning': { title: 'Machine Learning Fundamentals', difficulty: 'intermediate', minutes: 45 },
    'Distributed Systems': { title: 'Distributed Systems Design', difficulty: 'advanced', minutes: 60 },
    'Advanced Algorithms': { title: 'Advanced Algorithm Design', difficulty: 'advanced', minutes: 50 },
    'Cloud Architecture': { title: 'Cloud Computing Fundamentals', difficulty: 'intermediate', minutes: 40 }
  }
  
  let timeUsed = 0
  for (const gap of gaps) {
    if (timeUsed >= availableMinutes) break
    
    const topicData = gapTopics[gap]
    if (!topicData) continue
    
    if (timeUsed + topicData.minutes <= availableMinutes) {
      topics.push({
        title: topicData.title,
        reasoning: `This topic addresses a key gap in your profile for ${careerPath}.`,
        difficulty: topicData.difficulty,
        estimatedMinutes: topicData.minutes,
        searchQuery: gap
      })
      timeUsed += topicData.minutes
    }
  }
  
  // If not enough topics, add general ones
  if (topics.length < 3) {
    const generalTopics = [
      { title: 'Industry Best Practices', difficulty: 'beginner', minutes: 30 },
      { title: 'Professional Development', difficulty: 'beginner', minutes: 25 },
      { title: 'Technical Communication', difficulty: 'beginner', minutes: 20 }
    ]
    
    for (const gen of generalTopics) {
      if (topics.length >= 5 || timeUsed >= availableMinutes) break
      if (timeUsed + gen.minutes <= availableMinutes) {
        topics.push({
          title: gen.title,
          reasoning: 'Valuable skill for career growth.',
          difficulty: gen.difficulty,
          estimatedMinutes: gen.minutes,
          searchQuery: gen.title
        })
        timeUsed += gen.minutes
      }
    }
  }
  
  return { topics: topics.slice(0, 5) }
}

module.exports = { analyzeResume, generateLearningTopics }
