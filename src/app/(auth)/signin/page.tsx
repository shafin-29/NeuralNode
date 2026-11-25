import { SigninForm } from "@/features/auth/components/signin-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <div>
      <SigninForm />
    </div>
  );
};

export default Page;
