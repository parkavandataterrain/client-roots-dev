import { useEffect } from 'react';
import { unstable_usePrompt } from 'react-router-dom';

const useUnsavedChangesWarning = (isDirty) => {
  // Listen for beforeunload event to show alert
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message =
          'You have unsaved changes. Are you sure you want to leave?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  unstable_usePrompt({
    message: 'Are you sure you want to leave? You have unsaved changes.',
    when: ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  });
};

export { useUnsavedChangesWarning };
