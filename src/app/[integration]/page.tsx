"use client"
import { useParams } from "next/navigation"
import React from "react"

export default function Collection() {
  const params = useParams<{ data: string }>()

  return (
    <React.Fragment>
      <div>asda</div>
    </React.Fragment>
  )
}

