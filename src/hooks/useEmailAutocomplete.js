import { useState, useMemo } from 'react'
import { getSentEmails } from '../services/gmailService'

export function useEmailAutocomplete() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return []
    const emails = getSentEmails()
    return emails.filter((email) =>
      email.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const selectSuggestion = (email) => {
    setQuery(email)
    setShowSuggestions(false)
  }

  return {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
  }
}
