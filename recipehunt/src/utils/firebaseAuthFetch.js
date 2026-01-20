import { auth } from '../firebase/firebaseClient';

export async function firebaseAuthFetch(input, init = {}) {
  const currentUser = auth.currentUser;
  let token;
  if (currentUser) {
    try {
      token = await currentUser.getIdToken();
    } catch {
      token = undefined;
    }
  }

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
}


