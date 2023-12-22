import type { Article } from "@/app/utils";
import {
  compileArticleMDX,
  getArticleNames,
  getArticlePath,
  getSource,
  getTopics,
  getUtcDate,
} from "@/app/utils";
import { List } from "@/components/markdown/list";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";

const components = {
  ul: List,
};

type Props = {
  params: {
    topic: string;
    article: string;
  };
};

export async function generateStaticParams() {
  return getTopics().flatMap((topic) => {
    return getArticleNames(topic).map((article) => {
      return { topic, article: path.parse(article).name };
    });
  });
}

const Article = async (props: Props): Promise<JSX.Element> => {
  const { topic, article } = props.params;
  const filePath = getArticlePath(topic, `${article}.md`);
  const source = getSource(filePath, () => notFound());
  const { content, frontmatter } = await compileArticleMDX(source, components);
  const { title, creationDate } = frontmatter;

  return (
    <>
      <div className="flex flex-row gap-2 items-baseline mb-2">
        <h1 className="text-3xl">{title}</h1>/
        <Link href={`/articles/${topic}`} className="hover:underline">
          Return to <span className="capitalize font-bold">{topic}</span>
        </Link>
      </div>
      <div className="mb-2">{getUtcDate(creationDate)}</div>
      <div>{content}</div>
    </>
  );
};

export default Article;
