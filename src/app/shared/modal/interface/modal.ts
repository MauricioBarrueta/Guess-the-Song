export interface ModalInterface {
    title: string,
    content: string,
    type?: 'info' | 'warning' | 'error' | 'success' | 'confirm'
    confirmText?: string,
    cancelText?: string,
    autoCloseMs?: number,
    onConfirm: () => void,
    onCancel?: () => void,
}