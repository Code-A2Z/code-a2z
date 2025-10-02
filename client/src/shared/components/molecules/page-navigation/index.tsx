import { useEffect, useState } from 'react';
import { activeTabLineRef, activeTabRef } from './refs';

interface InPageNavigationProps {
  routes: string[];
  defaultHidden?: string[];
  defaultActiveIndex?: number;
  children: React.ReactNode;
}

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}: InPageNavigationProps) => {
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const changePageState = (btn: EventTarget, i: number) => {
    const { offsetWidth, offsetLeft } = btn as HTMLElement;
    if (activeTabLineRef && activeTabLineRef.current) {
      activeTabLineRef.current.style.width = offsetWidth + 'px';
      activeTabLineRef.current.style.left = offsetLeft + 'px';
      setInPageNavIndex(i);
    }
  };

  useEffect(() => {
    if (
      width > 766 &&
      inPageNavIndex !== defaultActiveIndex &&
      activeTabRef &&
      activeTabRef.current
    ) {
      changePageState(activeTabRef.current, defaultActiveIndex);
    }

    if (!isResizeEventAdded) {
      window.addEventListener('resize', () => {
        if (!isResizeEventAdded) {
          setIsResizeEventAdded(true);
        }

        setWidth(window.innerWidth);
      });
    }
  }, [width, defaultActiveIndex, inPageNavIndex, isResizeEventAdded]);

  return (
    <>
      <div className="relative mb-8 bg-[#fafafa] dark:bg-[#09090b] border-b border-gray-200 flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i === defaultActiveIndex ? activeTabRef : null}
              key={i}
              className={
                'p-4 px-5 capitalize ' +
                (inPageNavIndex === i
                  ? 'text-black dark:text-[#ededed] '
                  : 'text-dark-grey dark:text-[#a3a3a3] ' +
                    (defaultHidden.includes(route) ? 'md:hidden' : ''))
              }
              onClick={e => {
                changePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}

        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
