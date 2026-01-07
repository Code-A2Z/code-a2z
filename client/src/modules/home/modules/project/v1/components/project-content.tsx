import { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { OutputBlockData } from '@editorjs/editorjs';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';

const ParagraphBlock = ({ text }: { text: string }) => {
  return (
    <A2ZTypography
      variant="body1"
      text=""
      props={{
        dangerouslySetInnerHTML: { __html: text },
        sx: { lineHeight: 1.8 },
      }}
    />
  );
};

const HeaderBlock = ({ level, text }: { level: number; text: string }) => {
  const variant = level === 3 ? 'h5' : 'h4';
  const component = level === 3 ? 'h3' : 'h2';
  return (
    <A2ZTypography
      variant={variant}
      component={component}
      text=""
      props={{
        dangerouslySetInnerHTML: { __html: text },
        sx: { fontWeight: 600, mb: 2, mt: 3 },
      }}
    />
  );
};

const ImageBlock = ({ url, caption }: { url: string; caption: string }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        my: { xs: 2, md: 3 },
        '& img': {
          maxWidth: '100%',
          borderRadius: 2,
          height: 'auto',
        },
      }}
    >
      <img src={url} alt={caption} />
      {caption && (
        <A2ZTypography
          variant="body2"
          text={caption}
          props={{
            sx: {
              color: 'text.secondary',
              mt: 1,
            },
          }}
        />
      )}
    </Box>
  );
};

const QuoteBlock = ({ text, caption }: { text: string; caption: string }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        p: 2,
        pl: 3,
        my: { xs: 2, md: 3 },
        borderRadius: 1,
      }}
    >
      <A2ZTypography
        variant="h6"
        text={text}
        props={{
          sx: {
            mb: caption ? 1 : 0,
            fontStyle: 'italic',
          },
        }}
      />
      {caption && (
        <A2ZTypography
          variant="body2"
          text={caption}
          props={{
            sx: {
              color: 'primary.main',
            },
          }}
        />
      )}
    </Box>
  );
};

const ListBlock = ({ style, items }: { style: string; items: string[] }) => {
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  const styleType = style === 'ordered' ? 'decimal' : 'disc';
  return (
    <Box
      component={Tag}
      sx={{
        pl: 3,
        listStyleType: styleType,
        my: { xs: 2, md: 3 },
        '& li': {
          mb: 1,
        },
      }}
    >
      {items.map((item, i) => (
        <li key={i}>
          <A2ZTypography
            variant="body1"
            text=""
            props={{
              dangerouslySetInnerHTML: { __html: item },
            }}
          />
        </li>
      ))}
    </Box>
  );
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const theme = useTheme();
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
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        color: 'text.primary',
        p: 2,
        borderRadius: 2,
        overflow: 'auto',
        position: 'relative',
        my: { xs: 2, md: 3 },
      }}
    >
      {language && (
        <A2ZTypography
          variant="caption"
          text={language}
          props={{
            sx: {
              position: 'absolute',
              top: 8,
              left: 8,
              opacity: 0.7,
              textTransform: 'uppercase',
            },
          }}
        />
      )}
      <Button
        size="small"
        onClick={handleCopy}
        variant="outlined"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          minWidth: 'auto',
          px: 1.5,
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <Box
        component="pre"
        sx={{
          fontFamily: 'monospace',
          mt: language ? 4 : 0,
          whiteSpace: 'pre-wrap',
          fontSize: '0.875rem',
          lineHeight: 1.6,
        }}
      >
        {codeText}
      </Box>
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
