import { markdownify } from "@lib/utils/textConverter";
import {
  BsFileEarmarkText,
  BsBook,
  BsFile,
  BsBarChart,
  BsClipboard,
} from "react-icons/bs";
import Link from "next/link";
import Cta from "./components/Cta";

const Documents = ({ data }) => {
  const { frontmatter, content } = data;
  const { title, description, documents, call_to_action } = frontmatter;

  const getIcon = (iconName) => {
    switch (iconName) {
      case "file-text":
        return <BsFileEarmarkText />;
      case "book-open":
        return <BsBook />;
      case "file":
        return <BsFile />;
      case "bar-chart":
        return <BsBarChart />;
      case "clipboard":
        return <BsClipboard />;
      default:
        return <BsFile />;
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-center font-normal">{title}</h1>
        {description && <p className="mt-4 text-center">{description}</p>}
        <div className="content mt-16">{markdownify(content)}</div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {documents.map((item, index) => (
            <div
              key={index}
              className="flex items-start rounded-lg bg-theme-light p-8"
            >
              <div className="mr-4 text-5xl text-primary">
                {getIcon(item.icon)}
              </div>
              <div>
                <h3 className="h4 mb-2">{item.title}</h3>
                <p className="mb-4 text-sm">{item.description}</p>
                <Link
                  className="btn btn-primary btn-sm"
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Télécharger
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Cta cta={call_to_action} />
      </div>
    </section>
  );
};

export default Documents;
