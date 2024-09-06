import type { NavigationGuardNext } from 'vue-router'
import { SESSION_TOKEN_KEY } from "../../constants";
import dayjs from 'dayjs'
import { SessionObject } from "../../stores/v2/loginStore/interface";

export default async function requireAuth({ next, loginStore }: { next: NavigationGuardNext; loginStore: any }) {
  const loginRouteName = 'v2-login'
  try {
    const user = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!user) {
      return next({
        name: loginRouteName,
      })
    }
    const decodeUser: SessionObject = JSON.parse(user)
    if (!decodeUser.expiredAt) {
      return next({
        name: loginRouteName,
      })
    }
    if (dayjs().unix() > decodeUser.expiredAt) {
      return next({
        name: loginRouteName,
      })
    }
    loginStore.setAuthUser({
      name: decodeUser.name,
      token: decodeUser.token,
      basicAuth: decodeUser.basicAuth,
    })
  } catch (error) {
    console.error('error', error)
    return next({
      name: loginRouteName,
    })
  }

  return next()
}
