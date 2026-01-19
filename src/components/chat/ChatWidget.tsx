import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { ChatLauncher } from './ChatLauncher';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <>
      {!isOpen && <ChatLauncher onClick={handleOpen} />}
      <ChatWindow
        isOpen={isOpen}
        isMinimized={isMinimized}
        onClose={handleClose}
        onMinimize={handleMinimize}
      />
    </>
  );
};
