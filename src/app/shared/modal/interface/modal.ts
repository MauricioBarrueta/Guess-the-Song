export interface ModalInterface {
    icon: string,
    lyrics: string,
    confirmText?: string,
    cancelText?: string,
    onConfirm: () => void,
    onCancel?: () => void
}