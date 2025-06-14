import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../server";
import { logout } from "./actions";
import WelcomeDialogWrapper from "./welcome-dialog-wrapper";

export default async function AuthHeader() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // 로그아웃 상태일때
  if (error) {
    return (
      <Container>
        <Link className="w-18 cursor-pointer rounded-md bg-blue-700 p-1 text-center" href="/login">
          로그인
        </Link>
      </Container>
    );
  }

  // 사용자 프로필 정보 조회
  const { data: profileData, error: profileError } = await supabase.from("profiles").select("user_name").eq("user_id", data.user.id);

  if (profileError) {
    console.error("Error fetching data:", profileError);
    supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
  }

  const username = profileData?.[0]?.user_name;

  if (username) {
    // 기존 사용자인 경우
    return (
      <Container>
        <div className="flex flex-row gap-1">
          <Link className="cursor-pointer text-zinc-300 underline underline-offset-2" href="/mypage">
            {username}
          </Link>
          <p>님</p>
        </div>
        <form action={logout}>
          <button className="w-20 cursor-pointer rounded-md bg-blue-700 p-1 text-center" type="submit">
            로그아웃
          </button>
        </form>
      </Container>
    );
  } else {
    // 새 사용자인 경우 (닉네임이 없는 경우)
    return <WelcomeDialogWrapper />;
  }
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="m-1 flex w-70 flex-row items-center justify-end gap-5">{children}</div>;
}
