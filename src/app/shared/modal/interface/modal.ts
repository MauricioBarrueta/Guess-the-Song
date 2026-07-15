export interface ModalInterface {
    title: string,
    content: string,
    type?: 'info' | 'warning' | 'error' | 'success' | 'confirm'
    confirmText?: string,
    cancelText?: string,
    onConfirm: () => void,
    onCancel?: () => void,
}