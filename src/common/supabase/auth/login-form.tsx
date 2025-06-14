import { login, loginWithOAuth, signup } from "./actions";
export default async function LoginForm({ errorMessage, successMessage }: { errorMessage?: string; successMessage?: string }) {
  return (
    <div className="flex w-70 flex-col items-center gap-4 rounded-sm border p-2">
      <form className="flex flex-col items-center gap-4">
        <h1 className="py-3 pb-5 font-serif text-5xl">Welcome!</h1>
        <label className="flex w-full flex-col text-center">
          Email
          <input className="m-1 border-b focus:border-blue-400 focus:outline-none" name="email" type="email" required />
        </label>
        <label className="flex w-full flex-col text-center">
          Password
          <input className="m-1 border-b focus:border-blue-400 focus:outline-none" name="password" type="password" required />
        </label>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button className="w-full cursor-pointer rounded-sm bg-zinc-200 p-1 text-black" formAction={login}>
          Log in
        </button>
        <button className="w-full cursor-pointer rounded-sm bg-zinc-200 p-1 text-black" formAction={signup}>
          Sign up
        </button>
      </form>
      <form className="flex flex-col gap-4">
        <input type="hidden" name="provider" value="github" />
        <button className="w-full cursor-pointer rounded-sm bg-zinc-200 p-1 text-black" formAction={loginWithOAuth}>
          Log in with GitHub
        </button>
      </form>
    </div>
  );
}
