const pdfParse = require('pdf-parse')
const fs = require('fs')

/**
 * Extract raw text from a PDF buffer
 */
async function parsePDF(buffer) {
  const data = await pdfParse(buffer)
  return data.text
}

/**
 * Extract raw text from a .tex file buffer
 * Strips LaTeX commands and returns readable text
 */
function parseTEX(buffer) {
  let text = buffer.toString('utf-8')

  // Remove LaTeX comments
  text = text.replace(/%.*$/gm, '')
  // Remove common LaTeX commands but keep their arguments
  text = text.replace(/\\[a-zA-Z]+\*?\{([^}]*)\}/g, '$1 ')
  // Remove remaining LaTeX commands
  text = text.replace(/\\[a-zA-Z]+\*?/g, ' ')
  // Remove curly braces
  text = text.replace(/[{}]/g, ' ')
  // Remove square brackets
  text = text.replace(/\[[^\]]*\]/g, ' ')
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

/**
 * Parse resume from multer file object
 */
async function parseResume(file) {
  const ext = file.originalname.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    return { text: await parsePDF(file.buffer), type: 'pdf' }
  } else if (ext === 'tex') {
    return { text: parseTEX(file.buffer), type: 'tex' }
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or TEX file.')
  }
}

module.exports = { parseResume }
