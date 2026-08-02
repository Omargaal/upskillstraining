import { createFileRoute } from "@tanstack/react-router";
import { ITTrainingLanding } from "@/components/ITTrainingLanding";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "IT Training — UpskillsTraining" },
      { name: "description", content: "From zero experience to enterprise-ready IT skills. A structured, stackable programme in Microsoft Intune, Entra ID and Windows Autopilot." },
      { property: "og:title", content: "IT Training — UpskillsTraining" },
      { property: "og:description", content: "From zero experience to enterprise-ready IT skills — Microsoft Intune, Entra ID and Windows Autopilot training." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return <ITTrainingLanding />;
}
