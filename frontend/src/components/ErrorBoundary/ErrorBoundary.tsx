import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application crashed:", error);
    console.error(errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={`panel ${styles.card}`}>
            <h1>😵 Hoppá!</h1>

            <p>Valami váratlan hiba történt az alkalmazásban.</p>

            <div className={styles.buttons}>
              <button
                className="button buttonPrimary"
                onClick={this.handleReload}
              >
                Oldal frissítése
              </button>

              <Link to="/" className="button buttonSecondary">
                Főoldal
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
