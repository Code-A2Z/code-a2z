/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const ParagraphBlock = ({ data }) => (
  <Typography dangerouslySetInnerHTML={{ __html: data?.text || '' }} />
);

const HeaderBlock = ({ data }) => {
  const Tag = data?.level === 3 ? 'h3' : 'h2';
  const size = data?.level === 3 ? 'h5' : 'h4';
  return (
    <Typography
      variant={size}
      fontWeight="bold"
      dangerouslySetInnerHTML={{ __html: data?.text || '' }}
    />
  );
};

const ImageBlock = ({ data }) => (
  <Box textAlign="center" my={2}>
    <img
      src={data?.file?.url || ''}
      alt={data?.caption || ''}
      style={{ maxWidth: '100%', borderRadius: '8px' }}
    />
    {data?.caption && (
      <Typography variant="body2" color="text.secondary" mt={1}>
        {data.caption}
      </Typography>
    )}
  </Box>
);

const QuoteBlock = ({ data }) => (
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
      {data?.text}
    </Typography>
    {data?.caption && (
      <Typography variant="body2" color="purple">
        {data.caption}
      </Typography>
    )}
  </Box>
);

const ListBlock = ({ data }) => {
  const Tag = data?.style === 'ordered' ? 'ol' : 'ul';
  const styleType = data?.style === 'ordered' ? 'decimal' : 'disc';
  return (
    <Box component={Tag} pl={3} sx={{ listStyleType: styleType }}>
      {data?.items?.map((item, i) => (
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

const CodeBlock = ({ data }) => {
  const codeText = data?.code || '';
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
      {data?.language && (
        <Typography
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          {data.language}
        </Typography>
      )}
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

const ProjectContent = ({ block }) => {
  const { type, data } = block;

  switch (type) {
    case 'paragraph':
      return <ParagraphBlock data={data} />;
    case 'header':
      return <HeaderBlock data={data} />;
    case 'image':
      return <ImageBlock data={data} />;
    case 'quote':
      return <QuoteBlock data={data} />;
    case 'list':
      return <ListBlock data={data} />;
    case 'code':
      return <CodeBlock data={data} />;
    default:
      return null;
  }
};

export default ProjectContent;
