import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import Cta from "@layouts/components/Cta";
import Social from "@components/Social";

function ReseauxSociaux({ data }) {
  const { frontmatter } = data;
  const { title, description, social, social_descriptions, call_to_action } = frontmatter;

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal")}
        {markdownify(description, "p", "text-center mt-4")}
        <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(social).map(([platform, url]) => (
            url && (
              <div key={platform} className="text-center p-6 rounded-lg shadow-md">
                <Image
                  src={`/images/social/${platform}.svg`}
                  width={48}
                  height={48}
                  alt={platform}
                  className="mx-auto mb-4"
                />
                {markdownify(platform, "h3", "text-xl font-semibold mb-2")}
                <p className="mb-4">{social_descriptions[platform]}</p>
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Suivre sur {platform}
                </Link>
              </div>
            )
          ))}
        </div>
        <Cta cta={call_to_action} />
      </div>
    </section>
  );
}

export default ReseauxSociaux;