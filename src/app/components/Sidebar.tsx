'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { Transition, TransitionChild } from '@headlessui/react';
import RefreshButton from './RefreshButton';

type SidebarProps = {
  title: string;
  renderContent: (onClick?: () => void) => React.ReactNode;
};

const tableOfContentsClasses =
  'flex fixed z-10 left-0 top-0 h-10 pl-5 items-center text-sm cursor-pointer tracking-wide underline underline-offset-2';
const sidebarWrapperClasses = 'fixed z-10 left-0 top-10.5 w-56 bg-accent-200 overflow-hidden';
const sidebarClasses =
  'flex flex-col gap-y-8 h-screen overflow-y-scroll w-60 pt-5 pl-5 pr-9 sm:pr-5 pb-20';

const Sidebar = ({ title, renderContent }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={tableOfContentsClasses}
          >
            {title}
          </button>
          <RefreshButton className="fixed z-10 left-[180px] top-0 h-10 flex items-center" />
        </div>
        <Transition show={isSidebarOpen}>
          <TransitionChild>
            <div
              className="fixed z-10 top-10 left-0 right-0 bottom-0 h-screen bg-accent-400/70 transition duration-300 ease-out data-closed:opacity-0"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </TransitionChild>
          <TransitionChild>
            <div
              className={classNames(
                sidebarWrapperClasses,
                'h-screen',
                'transition duration-300 ease-out data-closed:-translate-x-full',
              )}
            >
              <div className={sidebarClasses}>
                {renderContent(() => setTimeout(() => setIsSidebarOpen(false), 400))}
              </div>
            </div>
          </TransitionChild>
        </Transition>
      </div>
    </>
  );
};

export default Sidebar;
