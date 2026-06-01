import type { VerificationForm } from '../types/app'
import { request } from './client'

export type MerchantProfile = Pick<
  VerificationForm,
  'businessName' | 'country' | 'platform' | 'website' | 'contactName' | 'contactEmail' | 'contactPhone'
>

export async function fetchProfile(accessToken: string) {
  const data = await request<{ profile: MerchantProfile }>('/api/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return data.profile
}

export async function saveProfile(profile: MerchantProfile, accessToken: string) {
  const data = await request<{ profile: MerchantProfile }>('/api/profile', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(profile),
  })

  return data.profile
}
