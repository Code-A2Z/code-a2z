import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { OutputBlockData } from '@editorjs/editorjs';

const ParagraphBlock = ({ text }: { text: string }) => {
  return <Typography dangerouslySetInnerHTML={{ __html: text }} />;
};

const HeaderBlock = ({ level, text }: { level: number; text: string }) => {
  const Tag = level === 3 ? 'h3' : 'h2';
  const size = level === 3 ? 'h5' : 'h4';
  return (
    <Typography
      component={Tag}
      variant={size}
      fontWeight="bold"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

const ImageBlock = ({ url, caption }: { url: string; caption: string }) => {
  return (
    <Box textAlign="center" my={2}>
      <img
        src={url}
        alt={caption}
        style={{ maxWidth: '100%', borderRadius: '8px' }}
      />
      {caption && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {caption}
        </Typography>
      )}
    </Box>
  );
};

const QuoteBlock = ({ text, caption }: { text: string; caption: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(128, 0, 128, 0.1)',
        borderLeft: '4px solid purple',
        p: 2,
        pl: 3,
        my: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {text}
      </Typography>
      {caption && (
        <Typography variant="body2" color="purple">
          {caption}
        </Typography>
      )}
    </Box>
  );
};

const ListBlock = ({ style, items }: { style: string; items: string[] }) => {
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  const styleType = style === 'ordered' ? 'decimal' : 'disc';
  return (
    <Box component={Tag} pl={3} sx={{ listStyleType: styleType }}>
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

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const codeText = code || '';
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

const ProjectContent = ({ block }: { block: OutputBlockData }) => {
  const { type, data } = block || {};

  switch (type) {
    case 'paragraph':
      return <ParagraphBlock text={data?.text ?? ''} />;
    case 'header':
      return <HeaderBlock level={data?.level ?? 2} text={data?.text ?? ''} />;
    case 'image':
      return (
        <ImageBlock url={data?.file?.url ?? ''} caption={data?.caption ?? ''} />
      );
    case 'quote':
      return (
        <QuoteBlock text={data?.text ?? ''} caption={data?.caption ?? ''} />
      );
    case 'list':
      return <ListBlock style={data?.style} items={data?.items || []} />;
    case 'code':
      return (
        <CodeBlock code={data?.code ?? ''} language={data?.language ?? ''} />
      );
    default:
      return null;
  }
};

export default ProjectContent;
