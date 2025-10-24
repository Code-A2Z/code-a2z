export enum PROJECT_CONTENT_BLOCKS_TYPES {
  PARAGRAPH = 'paragraph',
  HEADER = 'header',
  LIST = 'list',
  CODE = 'code',
  QUOTE = 'quote',
  DELIMITER = 'delimiter',
  IMAGE = 'image',
  TABLE = 'table',
  RAW = 'raw',
  EMBED = 'embed',
  WARNING = 'warning',
  CHECKLIST = 'checklist',
}

export interface PROJECT_CONTENT_BLOCKS {
  time?: number;
  version?: string;
  blocks: Array<{
    id?: string;
    type: PROJECT_CONTENT_BLOCKS_TYPES;
    data:
      | ParagraphBlockData
      | HeaderBlockData
      | ListBlockData
      | CodeBlockData
      | QuoteBlockData
      | DelimiterBlockData
      | ImageBlockData
      | TableBlockData
      | RawBlockData
      | EmbedBlockData
      | WarningBlockData
      | ChecklistBlockData;
  }>;
}

export interface ParagraphBlockData {
  text: string;
}

export interface HeaderBlockData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export enum LIST_STYLE {
  ORDERED = 'ordered',
  UNORDERED = 'unordered',
}

export interface ListBlockData {
  style: LIST_STYLE;
  items: Array<string>;
}

export interface CodeBlockData {
  code: string;
  language?: string;
}

export interface QuoteBlockData {
  text: string;
  caption?: string;
  alignment?: 'left' | 'center';
}

export interface DelimiterBlockData {
  [key: string]: never;
}

export interface ImageBlockData {
  file: {
    url: string;
  };
  caption?: string;
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
}

export interface TableBlockData {
  withHeadings?: boolean;
  content: Array<Array<string>>;
}

export interface RawBlockData {
  html: string;
}

export interface EmbedBlockData {
  service: string;
  source: string;
  embed: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface WarningBlockData {
  title: string;
  message: string;
}

export interface ChecklistBlockData {
  items: Array<{
    text: string;
    checked: boolean;
  }>;
}

export interface PROJECT_ACTIVITY {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  total_parent_comments: number;
}

export interface PROJECT_DB_STATE {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  repository_url: string;
  live_url: string | null;
  tags: Array<string>;
  content_blocks: Array<PROJECT_CONTENT_BLOCKS>;
  user_id: string;
  activity: PROJECT_ACTIVITY;
  is_draft: boolean;
  comment_ids: Array<string>;
  collaborator_ids: Array<string>;
  createdAt: string;
  updatedAt: string;
}
