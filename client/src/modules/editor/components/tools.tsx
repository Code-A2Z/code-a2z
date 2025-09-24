import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Code from "@editorjs/code";
import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import Attaches from "@editorjs/attaches";
import LinkTool from "@editorjs/link";

import { uploadImage } from "../../../shared/hooks/upload-image";

const uploadImageByFile = async (e: File) => {
  return await uploadImage(e).then(url => {
    if (url) {
      return {
        success: 1,
        file: { url }
      }
    }
  })
}

const uploadImageByURL = async (e: string) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    }
    catch (err) {
      reject(err);
    }
  })
  return link.then(url => {
    return {
      success: 1,
      file: { url }
    }
  })
}

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile
      }
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
  code: Code,
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
  },
  attaches: {
    class: Attaches,
    config: {
      uploader: {
        uploadByFile: uploadImageByFile,
        uploadByUrl: uploadImageByURL
      }
    }
  },
  linkTool: {
    class: LinkTool,
    config: {
      placeholder: "Type a link...",
    }
  },
};
