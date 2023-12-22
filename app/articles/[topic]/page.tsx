import { getArticles, getTopics } from "@/app/utils";
import Link from "next/link";

export async function generateStaticParams() {
  return getTopics().map((topic) => {
    return { topic };
  });
}

type Props = {
  params: {
    topic: string;
  };
};

const Articles = async (props: Props): Promise<JSX.Element> => {
  const { topic } = props.params;
  const articles = await getArticles(topic);
  return (
    <div>
      <div className="flex flex-row gap-2 items-baseline mb-6">
        <h1 className="text-3xl">
          Articles about <span className="capitalize font-bold">{topic}</span>
        </h1>
        /
        <a href="/" className="hover:underline">
          Back to Home
        </a>
      </div>
      <ul className="list-disc">
        {articles.map((article) => {
          return (
            <li key={article.id}>
              <Link
                href={`/articles/${topic}/${article.id}`}
                className="capitalize hover:underline"
              >
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Articles;
