import { useCallback, useRef, useState } from 'react';
import {
  Button,
  Modal,
  ModalActions,
  ModalActionsSeparator,
  ModalContent,
  ModalHeader,
  type ButtonIntent,
} from '@la-jarre-a-son/ui';

type ConfirmProps = {
  title?: string;
  message: string;
  confirmLabel?: string;
  confirmIntent?: ButtonIntent;
  cancelLabel?: string;
};

export function useConfirm(): [(confirmProps: ConfirmProps) => Promise<unknown>, () => React.ReactNode] {
  const [confirmProps, setConfirmProps] = useState<ConfirmProps | null>(null);
  const resolvePromise = useRef<(value: unknown) => void | null>(null);
  const rejectPromise = useRef<(value: unknown) => void | null>(null);

  const confirm = useCallback((props: ConfirmProps) => {
    setConfirmProps(props);
    const promise = new Promise((resolve, reject) => {
      resolvePromise.current = resolve;
      rejectPromise.current = reject;
    }).finally(() => {
      setConfirmProps(null);
    });
    return promise;
  }, []);

  const handleConfirm = useCallback((value: unknown) => {
    if (resolvePromise.current) {
      resolvePromise.current(value);
    }
  }, []);

  const handleCancel = useCallback((value: unknown) => {
    if (rejectPromise.current) {
      rejectPromise.current(value);
    }
  }, []);

  const renderConfirm = useCallback(() => {
    if (confirmProps) {
      const { title, message, cancelLabel = 'Cancel', confirmLabel = 'Confirm', confirmIntent = 'success' } = confirmProps;
      return (
        <Modal open={true} onClose={(closeReason) => handleCancel(closeReason)}>
          {title && <ModalHeader title={title} />}
          <ModalContent>{message}</ModalContent>
          <ModalActions>
            <Button intent="neutral" variant="ghost" onClick={() => handleCancel('cancelButton')}>
              {cancelLabel}
            </Button>
            <ModalActionsSeparator />
            <Button intent={confirmIntent} onClick={() => handleConfirm(true)}>
              {confirmLabel}
            </Button>
          </ModalActions>
        </Modal>
      );
    }
    return null;
  }, [confirmProps, handleCancel, handleConfirm]);

  return [confirm, renderConfirm];
}

export default useConfirm;
