"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from 'react-dom';

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useModal();
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Create a div element that will be appended to body for portal rendering
    const el = document.createElement('div');
    el.className = 'modal-portal';
    el.style.position = 'fixed';
    el.style.zIndex = '99999';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.pointerEvents = open ? 'auto' : 'none';
    
    // Append to body only when modal is open
    if (open) {
      document.body.appendChild(el);
      document.body.style.overflow = 'hidden';
      setPortalElement(el);
    }
    
    return () => {
      // Clean up on unmount
      if (document.body.contains(el)) {
        document.body.removeChild(el);
        document.body.style.overflow = 'auto';
      }
    };
  }, [open]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [open, setOpen]);

  // Handle clicks outside the modal
  useOutsideClick(modalRef, () => setOpen(false));

  // Only render when portal element exists
  if (!portalElement || !open) return null;

  return createPortal(
    <div className="modal-container fixed inset-0 flex items-center justify-center"
         style={{
           backgroundColor: 'transparent',
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 99999,
         }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={() => setOpen(false)}
      />
      
      {/* Modal container */}
      <motion.div
        ref={modalRef}
        className={cn(
          "w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden",
          className
        )}
        style={{
          position: 'relative',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '950px',
        }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(219, 39, 119, 0.1) 100%)',
          borderRadius: 'inherit',
        }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRadius: 'inherit',
        }} />
        
        {/* Glow effects */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit', opacity: 0.4 }}>
          <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full" style={{ 
            background: 'radial-gradient(circle, rgba(219, 39, 119, 0.4) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }} />
          <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full" style={{ 
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }} />
        </div>
        
        {/* Content container */}
        <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            style={{
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            aria-label="Close modal"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Content */}
          <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
            {children}
          </div>
        </div>
      </motion.div>
    </div>,
    portalElement
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div 
      className={cn("flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent", className)}
      style={{ 
        color: 'white',
        maxHeight: 'calc(90vh - 2rem)',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "p-4 border-t border-white/10 bg-white/5",
        className
      )}
      style={{ 
        backdropFilter: 'blur(4px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {children}
    </div>
  );
};

// Hook to detect clicks outside of a component
const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};
