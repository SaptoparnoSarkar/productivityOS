import ShowcaseSubjectList from "./ShowcaseSubjectList";
import XpBody from "./XpBody";

export default function ShowcaseHero() {
  return (
    <div className="flex flex-nowrap gap-6">
      <div>
        {" "}
        <h1 className="text-white">COMPLETED SUBJECTS</h1>
        <ShowcaseSubjectList />
      </div>
      <div>
        <XpBody />
      </div>
    </div>
  );
}
