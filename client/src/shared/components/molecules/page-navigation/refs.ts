import { createRef, RefObject } from 'react';

export const activeTabLineRef: RefObject<HTMLHRElement | null> = createRef();
export const activeTabRef: RefObject<HTMLButtonElement | null> = createRef();
