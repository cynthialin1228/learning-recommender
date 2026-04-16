const axios = require('axios')
const cheerio = require('cheerio')

// ---------------------------------------------------------------------------
// Curated free resource database
// Covers common topics across EE, CE, CS — used as primary source
// ---------------------------------------------------------------------------
const CURATED = [
  // Computer Science
  { keywords: ['algorithm', 'data structure'], title: 'Algorithms — MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['machine learning', 'ml'], title: 'Machine Learning — Andrew Ng (Coursera, free audit)', url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera', sourceType: 'text' },
  { keywords: ['machine learning', 'ml', 'deep learning'], title: 'ML Crash Course — Google', url: 'https://developers.google.com/machine-learning/crash-course', platform: 'Google', sourceType: 'text' },
  { keywords: ['deep learning', 'neural network'], title: 'Deep Learning Specialization — fast.ai', url: 'https://www.fast.ai/', platform: 'fast.ai', sourceType: 'text' },
  { keywords: ['web', 'html', 'css', 'javascript', 'frontend'], title: 'The Odin Project — Full Stack Web Dev', url: 'https://www.theodinproject.com/', platform: 'The Odin Project', sourceType: 'text' },
  { keywords: ['web', 'javascript', 'react', 'node'], title: 'freeCodeCamp — Web Development', url: 'https://www.freecodecamp.org/learn', platform: 'freeCodeCamp', sourceType: 'text' },
  { keywords: ['operating system', 'os', 'kernel'], title: 'Operating Systems — MIT OCW', url: 'https://ocw.mit.edu/courses/6-828-operating-system-engineering-fall-2012/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['database', 'sql', 'relational'], title: 'Databases — Stanford Online (free)', url: 'https://online.stanford.edu/courses/soe-ydatabases0005-databases-relational-databases-and-sql', platform: 'Stanford Online', sourceType: 'text' },
  { keywords: ['distributed system', 'cloud'], title: 'Distributed Systems — MIT 6.824', url: 'https://pdos.csail.mit.edu/6.824/', platform: 'MIT', sourceType: 'text' },
  { keywords: ['computer network', 'networking', 'tcp', 'ip'], title: 'Computer Networking — Khan Academy', url: 'https://www.khanacademy.org/computing/computers-and-internet', platform: 'Khan Academy', sourceType: 'text' },
  { keywords: ['python'], title: 'Python for Everybody — freeCodeCamp', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', platform: 'freeCodeCamp', sourceType: 'text' },
  { keywords: ['c++', 'cpp'], title: 'C++ Tutorial — learncpp.com', url: 'https://www.learncpp.com/', platform: 'learncpp.com', sourceType: 'text' },
  { keywords: ['software architecture', 'design pattern'], title: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns', platform: 'Refactoring Guru', sourceType: 'text' },

  // Computer Engineering
  { keywords: ['computer architecture', 'cpu', 'processor'], title: 'Computer Architecture — CMU (free)', url: 'https://www.cs.cmu.edu/~213/', platform: 'CMU', sourceType: 'text' },
  { keywords: ['assembly', 'asm', 'low level'], title: 'x86 Assembly — CS:APP Labs', url: 'https://csapp.cs.cmu.edu/', platform: 'CMU', sourceType: 'text' },
  { keywords: ['embedded', 'microcontroller', 'rtos', 'real-time'], title: 'Embedded Systems — UT Austin (edX, free audit)', url: 'https://www.edx.org/learn/embedded-systems/the-university-of-texas-at-austin-embedded-systems-shape-the-world-microcontroller-input-output', platform: 'edX', sourceType: 'text' },
  { keywords: ['fpga', 'vhdl', 'verilog', 'hdl'], title: 'FPGA Design — Nandland', url: 'https://nandland.com/', platform: 'Nandland', sourceType: 'text' },
  { keywords: ['digital logic', 'logic design', 'boolean'], title: 'Digital Logic — Nand2Tetris', url: 'https://www.nand2tetris.org/', platform: 'Nand2Tetris', sourceType: 'text' },
  { keywords: ['memory', 'cache', 'memory management'], title: 'Memory Systems — MIT OCW', url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['gpu', 'cuda', 'parallel'], title: 'GPU Computing — NVIDIA CUDA Toolkit Docs', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/', platform: 'NVIDIA', sourceType: 'text' },

  // Electrical Engineering
  { keywords: ['circuit', 'circuit analysis', 'kirchhoff'], title: 'Circuit Analysis — Khan Academy', url: 'https://www.khanacademy.org/science/electrical-engineering', platform: 'Khan Academy', sourceType: 'text' },
  { keywords: ['signal processing', 'dsp', 'fourier', 'filter'], title: 'Signal Processing — MIT OCW', url: 'https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['control system', 'pid', 'feedback control'], title: 'Control Systems — MIT OCW', url: 'https://ocw.mit.edu/courses/6-302-feedback-systems-spring-2007/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['power electronics', 'power system'], title: 'Power Electronics — MIT OCW', url: 'https://ocw.mit.edu/courses/6-334-power-electronics-spring-2007/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['electromagnetics', 'electromagnetic', 'rf', 'antenna'], title: 'Electromagnetics — MIT OCW', url: 'https://ocw.mit.edu/courses/6-013-electromagnetics-and-applications-spring-2009/', platform: 'MIT OCW', sourceType: 'text' },
  { keywords: ['microelectronics', 'semiconductor', 'transistor', 'mosfet'], title: 'Microelectronics — MIT OCW', url: 'https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/', platform: 'MIT OCW', sourceType: 'text' },

  // YouTube video resources (no API needed — direct links)
  { keywords: ['algorithm', 'data structure'], title: 'Data Structures Easy to Advanced — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['machine learning', 'ml'], title: 'Machine Learning Full Course — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['deep learning', 'neural network'], title: 'Neural Networks from Scratch — Sentdex (YouTube)', url: 'https://www.youtube.com/watch?v=Wo5dMEP_BbI', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['operating system', 'os'], title: 'Operating Systems — Neso Academy (YouTube)', url: 'https://www.youtube.com/watch?v=vBURTt97EkA', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['computer architecture', 'cpu'], title: 'Computer Architecture — Crash Course (YouTube)', url: 'https://www.youtube.com/watch?v=tpIctyqH29Q', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['circuit', 'circuit analysis'], title: 'Circuit Analysis — The Organic Chemistry Tutor (YouTube)', url: 'https://www.youtube.com/watch?v=OGa_b26eK2c', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['signal processing', 'dsp'], title: 'Digital Signal Processing — Iain Explains (YouTube)', url: 'https://www.youtube.com/watch?v=g-eNeXlZKAQ', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['control system', 'pid'], title: 'Control Systems — Brian Douglas (YouTube)', url: 'https://www.youtube.com/watch?v=oBc_BHxw78s', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['fpga', 'vhdl', 'verilog'], title: 'FPGA Tutorial — Nandland (YouTube)', url: 'https://www.youtube.com/watch?v=lLg1AgA2Xoo', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['embedded', 'microcontroller'], title: 'Embedded Systems — Phil\'s Lab (YouTube)', url: 'https://www.youtube.com/watch?v=3NU7kObVQH4', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['python'], title: 'Python Full Course — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['web', 'javascript'], title: 'JavaScript Full Course — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['database', 'sql'], title: 'SQL Full Course — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['computer network', 'networking'], title: 'Computer Networking Full Course — freeCodeCamp (YouTube)', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['distributed system'], title: 'Distributed Systems — Martin Kleppmann (YouTube)', url: 'https://www.youtube.com/watch?v=UEAMfLPZZhE', platform: 'YouTube', sourceType: 'video' },
  { keywords: ['digital logic', 'boolean'], title: 'Digital Electronics — Neso Academy (YouTube)', url: 'https://www.youtube.com/watch?v=M0mx8S05v60', platform: 'YouTube', sourceType: 'video' },
]

/**
 * Score a resource against a topic query.
 * Returns number of keyword matches.
 */
function score(resource, query) {
  const q = query.toLowerCase()
  return resource.keywords.filter((kw) => q.includes(kw)).length
}

/**
 * Find best matching curated resources for a topic.
 * @param {string} query - topic title or search query
 * @param {'video'|'text'|'both'} sourceType
 * @param {number} limit
 */
function findCurated(query, sourceType, limit = 3) {
  const pool = sourceType === 'both'
    ? CURATED
    : CURATED.filter((r) => r.sourceType === sourceType)

  const scored = pool
    .map((r) => ({ ...r, _score: score(r, query) }))
    .filter((r) => r._score > 0)
    .sort((a, b) => b._score - a._score)

  // If no keyword match, fall back to generic free resources
  if (scored.length === 0) {
    return buildFallback(query, sourceType, limit)
  }

  // Deduplicate by url, take top results
  const seen = new Set()
  const results = []
  for (const r of scored) {
    if (!seen.has(r.url)) {
      seen.add(r.url)
      results.push(r)
    }
    if (results.length >= limit) break
  }

  // Pad with fallback if not enough
  if (results.length < limit) {
    const fallback = buildFallback(query, sourceType, limit - results.length)
    results.push(...fallback)
  }

  return results.slice(0, limit)
}

/**
 * Generic fallback — search page links, always work without any API
 */
function buildFallback(query, sourceType, limit = 3) {
  const enc = encodeURIComponent(query)
  const all = [
    { title: `MIT OpenCourseWare: "${query}"`, url: `https://ocw.mit.edu/search/?q=${enc}`, platform: 'MIT OCW', sourceType: 'text' },
    { title: `freeCodeCamp: "${query}"`, url: `https://www.freecodecamp.org/news/search/?query=${enc}`, platform: 'freeCodeCamp', sourceType: 'text' },
    { title: `Khan Academy: "${query}"`, url: `https://www.khanacademy.org/search?page_search_query=${enc}`, platform: 'Khan Academy', sourceType: 'text' },
    { title: `YouTube: "${query}" tutorial`, url: `https://www.youtube.com/results?search_query=${enc}+tutorial+free`, platform: 'YouTube', sourceType: 'video' },
    { title: `edX: "${query}" free course`, url: `https://www.edx.org/search?q=${enc}`, platform: 'edX', sourceType: 'text' },
  ]

  const pool = sourceType === 'both' ? all : all.filter((r) => r.sourceType === sourceType)
  return pool.slice(0, limit)
}

/**
 * Main export — returns 2-3 resources for a topic
 */
async function searchResources(query, sourceType = 'both') {
  return findCurated(query, sourceType, 3)
}

module.exports = { searchResources }
