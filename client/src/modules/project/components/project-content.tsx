/* eslint-disable react/prop-types */
import { useState } from 'react';

const ProjectContent = ({ block }) => {
  const { type, data } = block;

  if (type === 'paragraph') {
    return <p dangerouslySetInnerHTML={{ __html: data?.text || '' }} />;
  }

  if (type === 'header') {
    const Tag = data?.level === 3 ? 'h3' : 'h2';
    const size = data?.level === 3 ? 'text-3xl' : 'text-4xl';
    return (
      <Tag
        className={`${size} font-bold`}
        dangerouslySetInnerHTML={{ __html: data?.text || '' }}
      />
    );
  }

  if (type === 'image') {
    return (
      <div>
        <img src={data?.file?.url || ''} alt={data?.caption || ''} />
        {data?.caption && (
          <p className="w-full text-center my-3 md:mb-12 text-base text-gray-700">
            {data.caption}
          </p>
        )}
      </div>
    );
  }

  if (type === 'quote') {
    return (
      <div className="bg-purple opacity-10 p-3 pl-5 border-l-4 border-purple">
        <p className="text-xl leading-10 md:text-2xl">{data?.text}</p>
        {data?.caption && (
          <p className="w-full text-purple text-base">{data.caption}</p>
        )}
      </div>
    );
  }

  if (type === 'list') {
    const Tag = data?.style === 'ordered' ? 'ol' : 'ul';
    const listClass = data?.style === 'ordered' ? 'list-decimal' : 'list-disc';
    return (
      <Tag className={`pl-5 ${listClass}`}>
        {data?.items?.map((item, i) => (
          <li
            key={i}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </Tag>
    );
  }

  if (type === 'code') {
    const codeText = data?.code || '';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = codeText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          {data?.language && (
            <span className="text-sm opacity-80 px-2 py-0.5 rounded bg-gray-800 text-white">
              {data.language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm border rounded bg-transparent hover:bg-gray-700 text-white"
            aria-label="Copy code"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
          <code>{codeText}</code>
        </pre>
      </div>
    );
  }

  return null;
};

export default ProjectContent;
