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

const ProjectContent = ({
  block,
}: {
  block: {
    type: string;
    data: {
      text?: string;
      level?: number;
      items?: string[];
      code?: string;
      caption?: string;
      stretched?: boolean;
      withBackground?: boolean;
      withBorder?: boolean;
      url?: string;
      source?: string;
      title?: string;
      file?: { url: string };
      style?: string;
    };
  };
}) => {
  const { type, data } = block;

  if (type === 'paragraph') {
    return <p dangerouslySetInnerHTML={{ __html: data.text || '' }}></p>;
  }

  if (type === 'header') {
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text || '' }}
        ></h3>
      );
    }
    return (
      <h2
        className="text-4xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text || '' }}
      ></h2>
    );
  }

  if (type === 'image') {
    return <Img url={data.file?.url || ''} caption={data.caption || ''} />;
  }

  if (type === 'quote') {
    return <Quote quote={data.text || ''} caption={data.caption || ''} />;
  }

  if (type === 'list') {
    return (
      <List
        style={(data.style as 'ordered' | 'unordered') || 'unordered'}
        items={data.items || []}
      />
    );
  }
};

export default ProjectContent;
