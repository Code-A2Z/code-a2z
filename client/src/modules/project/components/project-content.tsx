import { OutputBlockData } from '@editorjs/editorjs';
import { useState } from 'react';

const Img = ({ url, caption }: { url: string; caption: string }) => {
  return (
    <div>
      <img src={url} alt="" />
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-gray-700">
          {caption}
        </p>
      ) : (
        ''
      )}
    </div>
  );
};

const Quote = ({ quote, caption }: { quote: string; caption: string }) => {
  return (
    <div className="bg-purple opacity-10 p-3 pl-5 border-l-4 border-purple">
      <p className="text-xl leading-10 md:text-2xl">{quote}</p>
      {caption.length ? (
        <p className="w-full text-purple text-base">{caption}</p>
      ) : (
        ''
      )}
    </div>
  );
};

const List = ({
  style,
  items,
}: {
  style: 'ordered' | 'unordered';
  items: string[];
}) => {
  return (
    <ol
      className={`pl-5 ${style === 'ordered' ? ' list-decimal' : ' list-disc'}`}
    >
      {items.map((listItem, i) => {
        return (
          <li
            key={i}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: listItem }}
          ></li>
        );
      })}
    </ol>
  );
};

const ProjectContent = ({ block }: { block: OutputBlockData }) => {
  const { type, data } = block;

  if (type === 'paragraph') {
    return <p dangerouslySetInnerHTML={{ __html: data?.text || '' }}></p>;
  }

  if (type === 'header') {
    if (data?.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data?.text || '' }}
        ></h3>
      );
    }
    return (
      <h2
        className="text-4xl font-bold"
        dangerouslySetInnerHTML={{ __html: data?.text || '' }}
      ></h2>
    );
  }

  if (type === 'image') {
    return <Img url={data?.file?.url || ''} caption={data?.caption || ''} />;
  }

  if (type === 'quote') {
    return <Quote quote={data?.text || ''} caption={data?.caption || ''} />;
  }

  if (type === 'list') {
    return (
      <List
        style={(data?.style as 'ordered' | 'unordered') || 'unordered'}
        items={data?.items || []}
      />
    );
  }

  if (type === 'code') {
    // EditorJS code tool may store the actual code string under different keys
    // depending on the tool used. Common keys: `code`, `text`, or `data.code`.
    const codeText: string =
      (data && (data.code || data.text || data.source || data.code || '')) || '';

    // Some code tools include language info. Try common keys, otherwise try to
    // do a tiny heuristic check for language keywords (very small and best-effort).
    let language = data?.language || data?.lang || data?.meta?.language || '';

    if (!language) {
      const sample = (codeText || '').slice(0, 200).toLowerCase();
      if (/^\s*#include|std::|printf\(|cout\b/.test(sample)) language = 'cpp';
      else if (/^\s*import\s+react|from\s+'react'|console\.log\(/.test(sample))
        language = 'javascript';
      else if (/^\s*def\s+\w+\(|import\s+os\b|print\(/.test(sample)) language = 'python';
      else if (/^\s*<\w+.*>/.test(sample)) language = 'html';
      else language = '';
    }

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeText || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // fallback: select and copy
        const ta = document.createElement('textarea');
        ta.value = codeText || '';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          // ignore
        }
        document.body.removeChild(ta);
      }
    };

    return (
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          {language && (
            <span className="text-sm opacity-80 px-2 py-0.5 rounded bg-gray-800 text-white">{language}</span>
          )}
          <div className="ml-auto">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm border rounded bg-transparent hover:bg-gray-700 text-white"
              aria-label="Copy code"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
          <code>{codeText}</code>
        </pre>
      </div>
    );
  }
<<<<<<< HEAD
=======

  return null;
>>>>>>> 7d1792c (chore: final eslint and format clean — ready for review)
};

export default ProjectContent;
