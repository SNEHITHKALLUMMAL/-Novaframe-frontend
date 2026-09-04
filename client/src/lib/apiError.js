/**
 * Normalizes an Axios error against the server's standard error envelope
 * ({ success: false, message, errors: [{ field, message }] }) into a shape
 * forms can use directly: a top-level message plus a field -> message map.
 */
export function parseApiError(error) {
  const payload = error?.response?.data;
  const message = payload?.message || error?.message || 'Something went wrong';
  const fieldErrors = {};

  if (Array.isArray(payload?.errors)) {
    for (const e of payload.errors) {
      if (e.field) fieldErrors[e.field] = e.message;
    }
  }

  return { message, fieldErrors };
}
