import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import Cta from "@layouts/components/Cta";

function ReseauxSociaux({ data }) {
  const { frontmatter } = data;
  const { title, description, social_networks, call_to_action } = frontmatter;

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal")}
        {markdownify(description, "p", "text-center mt-4")}
        <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {social_networks.map((network, index) => (
            <div key={index} className="text-center p-6 rounded-lg shadow-md">
              <Image
                src={network.icon}
                width={48}
                height={48}
                alt={network.name}
                className="mx-auto mb-4"
              />
              {markdownify(network.name, "h3", "text-xl font-semibold mb-2")}
              <p className="mb-4">{network.description}</p>
              <Link
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Suivre sur {network.name}
              </Link>
            </div>
          ))}
        </div>
        <Cta cta={call_to_action} />
      </div>
    </section>
  );
}

export default ReseauxSociaux;
