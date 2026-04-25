import axios from 'axios'
import { toast } from 'sonner'


export function handleApiError(error: unknown, defaultMessage: string): string {
  if (axios.isAxiosError(error)) {
    const message = typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : defaultMessage

    console.error(message, error.response?.data)
    toast.error(message)
    return message
  }

  console.error(defaultMessage, error)
  toast.error(defaultMessage)
  return defaultMessage
}
