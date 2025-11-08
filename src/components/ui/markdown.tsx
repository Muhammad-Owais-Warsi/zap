import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save } from "lucide-react";
import { marked } from "marked";

interface MarkdownProps {
    children: string;
}

interface MarkdownEditorProps {
    initialContent?: string;

    onSave?: (content: string) => void;
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return (
        <div
            className=" mt-10 prose prose-neutral dark:prose-invert max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-2 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-1 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:mb-1 [&_h5]:mt-2 [&_h6]:text-base [&_h6]:font-semibold [&_h6]:mb-1 [&_h6]:mt-2 [&_p]:my-4 [&_p]:leading-7 [&_p]:text-muted-foreground [&_strong]:font-bold [&_strong]:text-foreground [&_em]:italic [&_del]:line-through [&_del]:opacity-70 [&_pre]:bg-muted/50 [&_pre]:border [&_pre]:border-border [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:shadow-sm [&_code]:bg-muted [&_code]:text-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:border [&_code]:border-border [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0 [&_pre_code]:text-sm [&_pre_code]:leading-relaxed [&_ul]:my-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_li]:my-2 [&_li]:text-muted-foreground [&_li]:leading-7 [&_li>ul]:mt-2 [&_li>ul]:ml-4 [&_li>ol]:mt-2 [&_li>ol]:ml-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80  [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:pr-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:bg-muted/30 [&_blockquote]:rounded-r [&_blockquote]:text-muted-foreground [&_blockquote>p]:my-2 [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-border [&_th]:bg-muted [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:border-b [&_th]:border-border [&_td]:px-4 [&_td]:py-2 [&_td]:border-b [&_td]:border-border [&_tr:last-child_td]:border-b-0 [&_tr:hover]:bg-muted/30 [&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:border [&_img]:border-border [&_img]:shadow-sm [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:accent-primary [&_.note]:bg-blue-500/10 [&_.note]:border-l-4 [&_.note]:border-blue-500 [&_.note]:p-4 [&_.note]:my-4 [&_.note]:rounded-r [&_.warning]:bg-yellow-500/10 [&_.warning]:border-l-4 [&_.warning]:border-yellow-500 [&_.warning]:p-4 [&_.warning]:my-4 [&_.warning]:rounded-r [&_.danger]:bg-red-500/10 [&_.danger]:border-l-4 [&_.danger]:border-red-500 [&_.danger]:p-4 [&_.danger]:my-4 [&_.danger]:rounded-r [&_.success]:bg-green-500/10 [&_.success]:border-l-4 [&_.success]:border-green-500 [&_.success]:p-4 [&_.success]:my-4 [&_.success]:rounded-r [&_.info]:bg-cyan-500/10 [&_.info]:border-l-4 [&_.info]:border-cyan-500 [&_.info]:p-4 [&_.info]:my-4 [&_.info]:rounded-r "
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    initialContent = "",
    onSave,
}) => {
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [tab, setTab] = useState<"edit" | "preview">("edit");
    const [previewHtml, setPreviewHtml] = useState("");

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    useEffect(() => {
        async function parse_markdown() {
            const html = await marked.parse(content || "");
            setPreviewHtml(html);
        }

        parse_markdown();
    }, [content]);

    const handleSave = () => {
        onSave?.(content);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setContent(initialContent);
    };

    if (!isEditing) {
        return (
            <div className="relative rounded-lg p-4 gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 hover:cursor-pointer"
                    onClick={() => setIsEditing(true)}
                >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Markdown>{marked.parse(content) as string}</Markdown>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3 w-full">
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="hover:cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="hover:cursor-pointer"
                    >
                        <Save className="mr-1 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>

            {tab === "edit" && (
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[60vh] font-mono resize-none"
                    placeholder="Write your markdown here..."
                />
            )}

            {tab === "preview" && (
                <div className="overflow-auto p-2 rounded-lg h-[60vh]">
                    <Markdown>{previewHtml}</Markdown>
                </div>
            )}
        </div>
    );
};

export default MarkdownEditor;
