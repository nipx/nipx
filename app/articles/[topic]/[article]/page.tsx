import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import path from "path";
import rehypePrism from "rehype-prism-plus";

type Props = {
  params: {
    topic: string;
    article: string;
  };
};

const getContent = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    notFound();
  }
};

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const articleFolders = fs.readdirSync(articlesDirectory);
  return articleFolders.flatMap((folder) => {
    const articleDirectory = path.join(articlesDirectory, folder);
    const files = fs.readdirSync(articleDirectory);
    return files.map((file) => {
      const fileNameWithoutExtension = path.parse(file).name;
      return { topic: folder, article: fileNameWithoutExtension };
    });
  });
}

const Article = (props: Props): JSX.Element => {
  const title = props.params.article.split("-").join(" ");
  const filePath = path.join(
    process.cwd(),
    "articles",
    props.params.topic,
    `${props.params.article}.md`
  );

  const content = getContent(filePath);

  const fileStats = fs.statSync(filePath);
  const creationDate = fileStats.birthtime;
  const modificationDate = fileStats.mtime;

  return (
    <>
      <div className="flex flex-row gap-2 items-baseline mb-4">
        <h1 className="text-3xl capitalize">{title}</h1>/
        <a href={`/articles/${props.params.topic}`} className="hover:underline">
          Return to{" "}
          <span className="capitalize font-bold">{props.params.topic}</span>
        </a>
      </div>
      <div>
        Created {creationDate.toDateString()} - Last modication{" "}
        {modificationDate.toDateString()}
      </div>
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypePrism],
          },
        }}
      />
    </>
  );
};

export default Article;
