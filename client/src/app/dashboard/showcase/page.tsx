import ShowcaseHero from "@/components/showcase/ShowcaseHero";

export default function ShowcasePage() {
  return (
    <div className="ml-14 mt-2 mr-12 mb-10">
      <div>
        <h1 className="header-text">Achievements</h1>
        <p className="subheading-text">
          Show off your hard work and inspire others.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center pt-10">
        <ShowcaseHero />
      </div>
    </div>
  );
}
