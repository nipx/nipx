import fs from "fs";
import { MDXRemoteProps, compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypePrism from "rehype-prism-plus";

export type Article = {
  title: string;
  creationDate: Date;
};

const getTopicsPath = () => {
  return path.join(process.cwd(), "articles");
};

export const getArticlePath = (folder: string, article: string) => {
  return path.join(getTopicsPath(), folder, article);
};

export const getTopics = () => {
  return fs.readdirSync(getTopicsPath());
};

export const getArticleNames = (folder: string) => {
  const articleDirectory = path.join(getTopicsPath(), folder);
  return fs.readdirSync(articleDirectory);
};

export const getSource = (filePath: string, onError?: () => never) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    if (onError) {
      onError();
    }
    throw error;
  }
};

export const getUtcDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${day}/${month}/${year}`;
};

export const compileArticleMDX = async (
  source: MDXRemoteProps["source"],
  components: MDXRemoteProps["components"]
) => {
  return compileMDX<Article>({
    source,
    components,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePrism],
      },
      parseFrontmatter: true,
    },
  });
};

export const getArticles = async (topic: string) => {
  return Promise.all(
    getArticleNames(topic).map(async (article) => {
      const articlePath = getArticlePath(topic, article);
      const articleName = path.parse(article).name;
      const source = getSource(articlePath);
      const { frontmatter } = await compileArticleMDX(source, null);
      return { id: articleName, title: frontmatter.title };
    })
  );
};
