import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { Contact } from '@/apis/contact/types'

export async function getContacts(
  params: GetParams<Contact>
): Promise<AxiosResponse<Contact[], null>> {
  return await api.get('/contacts/', {
    params
  })
}

export async function getContact(id: number): Promise<AxiosResponse<Contact, null>> {
  return await api.get(`/contacts/${id}/`)
}

export async function createContact(data: Contact): Promise<AxiosResponse<Contact, Contact>> {
  return await api.post('/contacts/', data)
}

export async function updateContact(
  data: Optionalize<Contact>
): Promise<AxiosResponse<Contact, Optionalize<Contact>>> {
  return await api.patch(`/contacts/${data.contact_id}/`, data)
}

export async function deleteContact(
  data: Optionalize<Contact>
): Promise<AxiosResponse<Contact, Optionalize<Contact>>> {
  return await api.patch(`/contacts/${data.contact_id}/`, data)
}
