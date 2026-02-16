const GMAIL_API_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/send'

/**
 * Converts a file to a base64-encoded string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Builds a MIME multipart message with attachment.
 */
async function buildMimeMessage({ to, from, subject, body, file }) {
  const boundary = 'swiftsend_boundary_' + Date.now()
  const fileBase64 = await fileToBase64(file)

  const mimeMessage = [
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    'MIME-Version: 1.0',
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject || 'Archivo enviado con SwiftSend'}`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    body || '',
    '',
    `--${boundary}`,
    `Content-Type: ${file.type || 'application/octet-stream'}; name="${file.name}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${file.name}"`,
    '',
    fileBase64,
    '',
    `--${boundary}--`,
  ].join('\r\n')

  return btoa(unescape(encodeURIComponent(mimeMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Sends an email with attachment via the Gmail API.
 */
export async function sendEmailWithAttachment({ accessToken, to, from, subject, body, file }) {
  if (!accessToken) {
    throw new Error('No se encontró un token de acceso. Inicia sesión nuevamente.')
  }

  const raw = await buildMimeMessage({ to, from, subject, body, file })

  const response = await fetch(GMAIL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message =
      error?.error?.message || `Error al enviar el correo (${response.status})`
    throw new Error(message)
  }

  return response.json()
}

/**
 * Saves a successfully sent email to localStorage for autocomplete.
 */
export function saveSentEmail(email) {
  const key = 'swiftsend_sent_emails'
  const stored = JSON.parse(localStorage.getItem(key) || '[]')
  if (!stored.includes(email)) {
    stored.unshift(email)
    localStorage.setItem(key, JSON.stringify(stored.slice(0, 50)))
  }
}

/**
 * Retrieves previously sent emails from localStorage.
 */
export function getSentEmails() {
  return JSON.parse(localStorage.getItem('swiftsend_sent_emails') || '[]')
}
