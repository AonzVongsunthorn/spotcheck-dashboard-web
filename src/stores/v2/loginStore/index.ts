import { defineStore } from "pinia";
import { LoginParams, SessionObject, UserStore } from "./interface";
import { callLoginAPI } from "../../../services/api/v2/auth";
import dayjs from 'dayjs'
import { SESSION_TOKEN_KEY } from "../../../constants";

export const useLoginStore = defineStore({
  id: 'loginStore',
  state: () => {
    return {
      authUser: {
        name: '',
        token: '',
        basicAuth: ''
      }
    }
  },
  actions: {
    async login(user: LoginParams) {
      const loginResult = await callLoginAPI( { username: user.username, password: user.password})
      if (loginResult.isSuccess) {
        const session: SessionObject = {
          name: user.username,
          token: loginResult.token,
          basicAuth: `basic ${btoa(`${user.username}:${user.password}`)}`,
          expiredAt: user.isRememberSession ? dayjs().hour(23, ).minute(59).second(59).unix() : dayjs().add(3, 'hour').unix()
        }
        localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(session));
        this.setAuthUser({
          name: user.username,
          token: loginResult.token,
          basicAuth: `basic ${btoa(`${user.username}:${user.password}`)}`,
        })
      }
      return loginResult;
    },
    setAuthUser(user: UserStore) {
      this.authUser = user
    },
  },
  getters: {
    getLoggedInUserFullName(state) {
      return state?.authUser?.name || '-'
    },
  }
})
