import Layout from "@/Layouts/Layout";
import Markdown from "react-markdown";

export default function Page({ page }) {
    const { title, content } = page;
    return (
        <Layout sideBar={false}>
            <div className="mx-auto max-w-3xl">
                <header>
                    <h1 className="text-3xl font-extrabold capitalize my-5">
                        {title}
                    </h1>
                </header>
                <article className="mt-10 markdown-body pb-20 ">
                    <Markdown>{content.trim()}</Markdown>
                </article>
            </div>
        </Layout>
    );
}
