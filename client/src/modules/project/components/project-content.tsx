import { OutputBlockData } from '@editorjs/editorjs';
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ProjectContentProps {
  block: OutputBlockData;
}

type EJData = Record<string, unknown> | undefined;

const ParagraphBlock = ({ data }: { data?: EJData }) => {
  const text = (data && (data['text'] as string)) || '';
  return <Typography dangerouslySetInnerHTML={{ __html: text }} />;
};

const HeaderBlock = ({ data }: { data?: EJData }) => {
  const level = (data && (data['level'] as number)) || 2;
  const Tag = level === 3 ? 'h3' : 'h2';
  const size = level === 3 ? 'h5' : 'h4';
  const text = (data && (data['text'] as string)) || '';
  return (
    <Typography
      component={Tag as React.ElementType}
      variant={size as 'h4' | 'h5'}
      fontWeight="bold"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

const ImageBlock = ({ data }: { data?: EJData }) => {
  const file = data && (data['file'] as EJData);
  const url = (file && (file['url'] as string)) || '';
  const caption = (data && (data['caption'] as string)) || '';
  return (
    <Box textAlign="center" my={2}>
      <img
        src={url}
        alt={caption}
        style={{ maxWidth: '100%', borderRadius: '8px' }}
      />
      {caption ? (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
};

const QuoteBlock = ({ data }: { data?: EJData }) => {
  const text = (data && (data['text'] as string)) || '';
  const caption = (data && (data['caption'] as string)) || '';
  return (
    <Box
      sx={{
        bgcolor: 'rgba(128, 0, 128, 0.1)',
        borderLeft: '4px solid purple',
        p: 2,
        pl: 3,
        my: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {text}
      </Typography>
      {caption ? (
        <Typography variant="body2" color="purple">
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
};

const ListBlock = ({ data }: { data?: EJData }) => {
  const style = (data && (data['style'] as string)) || 'unordered';
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  const styleType = style === 'ordered' ? 'decimal' : 'disc';
  const items = (data && (data['items'] as string[])) || [];
  return (
    <Box
      component={Tag as React.ElementType}
      pl={3}
      sx={{ listStyleType: styleType }}
    >
      {items.map((item, i) => (
        <li key={i}>
          <Typography
            dangerouslySetInnerHTML={{ __html: item }}
            variant="body1"
          />
        </li>
      ))}
    </Box>
  );
};

const CodeBlock = ({ data }: { data?: EJData }) => {
  const codeText = (data && (data['code'] as string)) || '';
  const language = (data && (data['language'] as string)) || '';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#1e1e1e',
        color: '#f5f5f5',
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {language ? (
        <Typography
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          {language}
        </Typography>
      ) : null}
      <Button
        size="small"
        onClick={handleCopy}
        variant="outlined"
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <Typography
        component="pre"
        sx={{ fontFamily: 'monospace', mt: 4, whiteSpace: 'pre-wrap' }}
      >
        {codeText}
      </Typography>
    </Box>
  );
};

const ProjectContent = ({ block }: ProjectContentProps) => {
  const { type, data } = block;

  switch (type) {
    case 'paragraph':
      return <ParagraphBlock data={data as EJData} />;
    case 'header':
      return <HeaderBlock data={data as EJData} />;
    case 'image':
      return <ImageBlock data={data as EJData} />;
    case 'quote':
      return <QuoteBlock data={data as EJData} />;
    case 'list':
      return <ListBlock data={data as EJData} />;
    case 'code':
      return <CodeBlock data={data as EJData} />;
    default:
      return null;
  }
};

export default ProjectContent;
