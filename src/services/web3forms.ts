export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
export const CONTACT_SUBJECT = "New message from Ruan Coetzee's Portfolio";
export const CONTACT_FROM_NAME = "Ruan Coetzee's Portfolio Website";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactSubmissionResult =
  | { success: true }
  | { success: false; message: string };

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

export async function submitContactForm(
  values: ContactFormValues,
  accessKey: string,
  fetcher: typeof fetch = fetch,
): Promise<ContactSubmissionResult> {
  if (!accessKey.trim()) {
    return { success: false, message: 'The contact form is not configured yet.' };
  }

  const body = new FormData();
  body.set('access_key', accessKey);
  body.set('subject', CONTACT_SUBJECT);
  body.set('from_name', CONTACT_FROM_NAME);
  body.set('name', values.name);
  body.set('email', values.email);
  body.set('reply_to', values.email);
  body.set('phone', values.phone);
  body.set('message', values.message);

  const response = await fetcher(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    body,
    headers: { Accept: 'application/json' },
  });
  const result = await response.json() as Web3FormsResponse;

  if (result.success) return { success: true };
  return { success: false, message: result.message || 'Something went wrong.' };
}
