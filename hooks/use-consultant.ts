import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Consultant } from "@/types"

export function useConsultant() {
  const [consultant, setConsultant] = useState<Consultant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConsultant()
  }, [])

  const fetchConsultant = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .limit(1)
        .maybeSingle()

      if (error) throw error
      setConsultant(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch consultant")
    } finally {
      setLoading(false)
    }
  }

  const updateConsultant = async (updates: Partial<Consultant>) => {
    try {
      if (!consultant) throw new Error("No consultant found")
      
      const { data, error } = await supabase
        .from("consultants")
        .update(updates)
        .eq("id", consultant.id)
        .select()
        .single()

      if (error) throw error
      setConsultant(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update consultant")
      throw err
    }
  }

  return {
    consultant,
    loading,
    error,
    fetchConsultant,
    updateConsultant,
  }
} 