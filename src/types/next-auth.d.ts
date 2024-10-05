import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface _Session {
    user: {
      accessToken: string
    } & DefaultSession["user"]
  }
}
