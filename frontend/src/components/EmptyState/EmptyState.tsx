import type { ReactNode } from "react";

import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className={`panel ${styles.container}`}>
      <div className={styles.icon}>{icon}</div>

      <h2 className={styles.title}>{title}</h2>

      {description && <p className={styles.description}>{description}</p>}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
