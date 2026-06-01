import type { ProductRecord, VerificationForm, VerificationReport } from '../types/app'
import { request } from './client'

export type StoredSubmission = {
  id: string
  createdAt: string
  form: VerificationForm
  report: VerificationReport
  activity: {
    title: string
    detail: string
    when: string
  }
  product: ProductRecord
}

export async function fetchSubmissions(accessToken: string) {
  const data = await request<{ submissions: StoredSubmission[] }>('/api/submissions', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return data.submissions
}

export async function saveSubmission(form: VerificationForm, report: VerificationReport, accessToken: string) {
  const data = await request<{ submission: StoredSubmission }>('/api/submissions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ form, report }),
  })
  return data.submission
}
