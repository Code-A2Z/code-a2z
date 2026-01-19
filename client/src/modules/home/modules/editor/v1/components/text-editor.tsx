import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import EditorJS, { EditorConfig } from '@editorjs/editorjs';
import { tools } from './tools';
import { useAtomValue, useSetAtom } from 'jotai';
import { EditorContentAtom, TextEditorAtom } from '../states';

const A2ZTextEditor = () => {
  const editorContent = useAtomValue(EditorContentAtom);
  const setTextEditor = useSetAtom(TextEditorAtom);

  const editorJSRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isOnStrictMode = useRef<boolean>(false);

  useEffect(() => {
    if (editorContainerRef.current !== null && !isOnStrictMode.current) {
      isOnStrictMode.current = true;
      const editorConf: EditorConfig = {
        holder: editorContainerRef.current,
        data: Array.isArray(editorContent?.content)
          ? editorContent.content[0]
          : editorContent?.content,
        tools: tools,
        placeholder:
          'Type away… share your code, your journey, and what makes your project awesome!',
      };
      const editor = new EditorJS(editorConf);
      editorJSRef.current = editor;
      setTextEditor({ editor: editor, isReady: true });
    }

    return () => {
      if (
        editorJSRef.current !== null &&
        editorJSRef.current!.destroy !== undefined
      ) {
        isOnStrictMode.current = false;
        editorJSRef.current.destroy();
        editorJSRef.current = null;
      }
    };
  }, [editorContent?.content, setTextEditor]);

  return (
    <Box
      ref={editorContainerRef}
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        paddingY: 3,
        backgroundColor: theme => theme.palette.background.paper,
        boxShadow: theme => theme.shadows[1],
        '&:focus-within': {
          borderColor: theme => theme.palette.primary.main,
          boxShadow: theme => `0 0 0 2px ${theme.palette.primary.main}20`,
        },
        '& .ce-block': {
          marginBottom: '1rem',
        },
        '& .ce-toolbar__plus, & .ce-toolbar__settings-btn': {
          color: theme => theme.palette.text.secondary,
        },
        '& .ce-paragraph': {
          fontFamily: theme => theme.typography.fontFamily,
          fontSize: theme => theme.typography.body1.fontSize,
          lineHeight: theme => theme.typography.body1.lineHeight,
          color: theme => theme.palette.text.primary,
        },
        '& .ce-header': {
          fontFamily: theme => theme.typography.h5.fontFamily,
          color: theme => theme.palette.text.primary,
          fontWeight: 600,
        },
      }}
    />
  );
};

export default A2ZTextEditor;
