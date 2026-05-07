import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard"

export const metadata = {
  title: "Profile | SkillGap",
  description: "Set up your profile to run your first diagnostic.",
}

export default function ProfilePage() {
  return <OnboardingWizard />
}
