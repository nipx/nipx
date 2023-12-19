import fs from "fs";
import Link from "next/link";
import path from "path";

const Home = () => {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const folders = fs.readdirSync(articlesDirectory);
  return (
    <div className="h-max">
      <h1 className="text-3xl mb-4">Articles</h1>
      <ul className="list-disc">
        {folders.map((folder) => {
          const topicDirectory = path.join(process.cwd(), "articles", folder);
          const files = fs.readdirSync(topicDirectory);
          return (
            <li key={folder}>
              <Link
                href={`/articles/${folder}`}
                className="capitalize text-xl hover:underline"
              >
                {folder}
              </Link>{" "}
              ( {files.length} )
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
