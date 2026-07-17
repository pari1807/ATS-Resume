import type { Route } from "./+types/home";
import ResumeCard from "../components/ResumeCard";
import { resumes } from "../../constants";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "MatchRate" },
    { name: "description", content: "Smart feedback for your Dream Job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-no-repeat bg-center">
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications and Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
      </section>
      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
