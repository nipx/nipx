import fs from "fs";
import Link from "next/link";
import path from "path";

type Props = {
  params: {
    topic: string;
  };
};

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const articleFolders = fs.readdirSync(articlesDirectory);
  return articleFolders.map((folder) => {
    return { topic: folder };
  });
}

const Articles = (props: Props): JSX.Element => {
  const topicDirectory = path.join(
    process.cwd(),
    "articles",
    props.params.topic
  );
  const files = fs.readdirSync(topicDirectory);
  return (
    <div>
      <div className="flex flex-row gap-2 items-baseline mb-6">
        <h1 className="text-3xl">
          Articles about{" "}
          <span className="capitalize font-bold">{props.params.topic}</span>
        </h1>
        /
        <a href="/" className="hover:underline">
          Back to Home
        </a>
      </div>
      <ul className="list-disc">
        {files.map((file) => {
          const fileNameWithoutExtension = path.parse(file).name;
          const fileNameFormatted = fileNameWithoutExtension.replace(/-/g, " ");
          return (
            <li key={file}>
              <Link
                href={`/articles/${props.params.topic}/${fileNameWithoutExtension}`}
                className="capitalize hover:underline"
              >
                {fileNameFormatted}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Articles;
