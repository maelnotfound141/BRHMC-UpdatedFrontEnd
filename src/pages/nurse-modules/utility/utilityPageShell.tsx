import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { all_routes } from "@/routes/all_routes";

type UtilityPageShellProps = {
  title: string;
  subtitle: string;
  icon: string;
  children: ReactNode;
};

const UtilityPageShell = ({
  title,
  subtitle,
  icon,
  children,
}: UtilityPageShellProps) => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .ward-utility-page-card {
          border-top: 4px solid var(--primary, #0f763f);
        }

        .ward-utility-page-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2px solid var(--primary, #0f763f);
          background: #f8f9fa;
          color: var(--primary, #0f763f);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ward-utility-page-action {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          background: #fff;
          color: #212529;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ward-utility-page-action:hover {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .ward-utility-page-section {
          background: #eef5f8;
          border-top: 1px solid #dce5ea;
          border-bottom: 1px solid #dce5ea;
        }

        .ward-utility-page-body {
          min-height: 420px;
          background: #fff;
        }
      `}</style>

      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 ward-utility-page-card">
            <div className="bg-white px-3 px-md-4 pt-4">
              <div className="d-flex justify-content-between align-items-center gap-3 pb-4 border-bottom">
                <div className="d-flex align-items-center gap-3 min-width-0">
                  <div className="ward-utility-page-icon">
                    <i className={`${icon} fs-3`} />
                  </div>

                  <div className="min-width-0">
                    <h4 className="fw-bold mb-1 text-dark text-uppercase text-truncate">
                      {title}
                    </h4>
                    <p className="text-muted small mb-0">{subtitle}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm border fw-bold d-flex align-items-center gap-2 px-3 py-2"
                    onClick={() => navigate(all_routes.nurseUtility)}
                  >
                    <i className="isax isax-arrow-left-2" />
                    <span className="d-none d-sm-inline">Back</span>
                  </button>

                  <button
                    type="button"
                    className="ward-utility-page-action"
                    aria-label="Back to nurse dashboard"
                    title="Back to nurse dashboard"
                    onClick={() => navigate(all_routes.nurseDashboard)}
                  >
                    <i className="isax isax-close-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="ward-utility-page-section px-3 py-2">
              <h6 className="fw-bold mb-0 text-dark">{title}</h6>
            </div>

            <div className="ward-utility-page-body p-3 p-md-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UtilityPageShell;
