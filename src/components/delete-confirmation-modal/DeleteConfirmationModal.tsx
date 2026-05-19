import type { ReactNode } from "react";

interface DeleteConfirmationModalProps {
  message: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  heading?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

const DeleteConfirmationModal = ({
  message,
  onCancel,
  onConfirm,
  title = "Confirm Delete",
  heading = "Delete Record?",
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
}: DeleteConfirmationModalProps) => {
  return (
    <>
      <style>
        {`
          .acc-info-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1080;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }

          .acc-info-box {
            width: 360px;
            max-width: 100%;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
          }

          .acc-info-title {
            height: 42px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            font-size: 14px;
            font-weight: 700;
          }

          .acc-info-icon {
            width: 42px;
            height: 42px;
            background: var(--primary, #0f763f);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
          }

          .acc-info-icon-danger {
            background: #dc3545;
          }

          .acc-info-action-btn {
            border-radius: 4px;
            font-size: 0.82rem;
          }

          @media (max-width: 991.98px) {
            .acc-info-box {
              width: 90%;
            }
          }

          @media (max-width: 767.98px) {
            .acc-info-title {
              font-size: 13px;
              padding: 0 10px;
            }

            .acc-info-icon {
              width: 38px;
              height: 38px;
              font-size: 18px;
            }

            .acc-info-action-btn {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="acc-info-backdrop">
        <div
          className="acc-info-box shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deleteConfirmTitle"
        >
          <div className="acc-info-title">
            <span id="deleteConfirmTitle">{title}</span>

            <button
              type="button"
              className="btn-close btn-close-sm"
              aria-label="Close delete confirmation"
              onClick={onCancel}
            />
          </div>

          <div className="d-flex align-items-center gap-3 p-4">
            <div className="acc-info-icon acc-info-icon-danger">
              <i className="isax isax-trash"></i>
            </div>

            <div>
              <div className="fw-bold text-dark mb-1">{heading}</div>

              <div className="small fw-semibold text-muted">{message}</div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 px-4 pb-3">
            <button
              type="button"
              className="btn btn-sm btn-light fw-bold px-4 border acc-info-action-btn"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-danger fw-bold px-4 acc-info-action-btn"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
