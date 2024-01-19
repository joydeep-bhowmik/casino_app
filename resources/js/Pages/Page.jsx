import Layout from "@/Layouts/Layout";
import Markdown from "react-markdown";

export default function Page({ page }) {
    const { title, slug, content } = page;
    console.log(page);
    return (
        <Layout>
            <header>
                <h1>{title}</h1>
            </header>
            <atricle>
                <Markdown> {content}</Markdown>
            </atricle>
        </Layout>
    );
}
