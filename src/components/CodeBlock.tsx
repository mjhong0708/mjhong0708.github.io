import type { BundledLanguage } from "shiki";
import {
  CodeBlock as AiCodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "./ai-elements/code-block";
import { FileIcon } from "lucide-react";

export default function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language: BundledLanguage;
  filename: string;
}) {
  return (
    <AiCodeBlock
      code={code}
      language={language}
      showLineNumbers={true}
      className="not-prose"
    >
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileIcon size={14} />
          <CodeBlockFilename>{filename}</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton
            onCopy={() => {
              console.log("Code copied!");
            }}
          />
        </CodeBlockActions>
      </CodeBlockHeader>
    </AiCodeBlock>
  );
}
