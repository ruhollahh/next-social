import { createRouter } from "../createRouter";

export const authRouter = createRouter().query("getSession", {
  async resolve({ ctx }) {
    // The session object is added to the routers context
    // in the context file server side
    return ctx.session;
  },
});
