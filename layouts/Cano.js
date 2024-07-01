import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import Cta from "./components/Cta";

function Cano({ data }) {
  const { frontmatter } = data;
  const { title, description, sections, call_to_action } = frontmatter;

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal text-h1 mb-8")}
        {description &&
          markdownify(description, "p", "text-center mt-4 text-lg text-text")}
        <div className="mt-16 space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="rounded-lg border border-border p-8">
              {markdownify(section.title, "h2", "mb-4 text-h3 text-dark")}
              <div className="content prose max-w-none">
                {markdownify(section.content)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Cta cta={call_to_action} />
        </div>
      </div>
    </section>
  );
}

export default Cano;
