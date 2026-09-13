import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import SignInForm from "../../components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Dubai Police",
  description:
    "Sign in with UAE PASS or your Dubai Police account to track applications and use personalised services.",
};

export default function SignInPage() {
  return (
    <PageShell
      title="Sign In"
      intro="Sign in to track your applications, save your details and reach personalised services."
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <SignInForm />
        </div>
      </section>
    </PageShell>
  );
}
