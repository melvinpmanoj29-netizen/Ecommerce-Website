interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: "default" | "danger";
  
}


function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-theme-card border border-theme rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-bold text-theme-primary mb-2">
          {title}
        </h2>

        <p className="text-theme-muted mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-theme text-theme-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
            variant === "danger"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#2874F0] hover:bg-[#1d65d1]"
          }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;