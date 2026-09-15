"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Server, Activity, Zap, DollarSign } from 'lucide-react';

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch actual health from our local backend
    fetch('http://localhost:3000/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch health:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard Overview</h1>
        <p className={styles.subtitle}>System metrics and current router status.</p>
      </header>

      <section className={styles.metricsGrid}>
        <div className="card">
          <div className={styles.cardHeader}>
            <span className="card-title">System Status</span>
            <Server className={styles.iconInfo} size={24} />
          </div>
          <div className="card-value">
            {loading ? "Checking..." : (health?.status === "ok" ? "Online" : "Offline")}
          </div>
          <p className={styles.cardMeta}>
            {health?.uptime ? `Uptime: ${Math.floor(health.uptime)}s` : "Backend not responding"}
          </p>
        </div>

        <div className="card">
          <div className={styles.cardHeader}>
            <span className="card-title">Total Requests</span>
            <Activity className={styles.iconAccent} size={24} />
          </div>
          <div className="card-value">1,492</div>
          <p className={styles.cardMeta}>+12% from last week</p>
        </div>

        <div className="card">
          <div className={styles.cardHeader}>
            <span className="card-title">Avg Latency</span>
            <Zap className={styles.iconWarning} size={24} />
          </div>
          <div className="card-value">245ms</div>
          <p className={styles.cardMeta}>Optimized by Code-Pilot</p>
        </div>

        <div className="card">
          <div className={styles.cardHeader}>
            <span className="card-title">Cost Saved</span>
            <DollarSign className={styles.iconSuccess} size={24} />
          </div>
          <div className="card-value">$34.50</div>
          <p className={styles.cardMeta}>vs running on GPT-4</p>
        </div>
      </section>
      
      <section className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className="card">
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>⚡</div>
              <div className={styles.activityDetails}>
                <strong>Routed to qwen2.5:3b</strong>
                <span>Task: Simple Refactoring • Saved $0.05</span>
              </div>
              <div className={styles.activityTime}>2 mins ago</div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>🧠</div>
              <div className={styles.activityDetails}>
                <strong>Routed to gpt-4o</strong>
                <span>Task: Complex Architecting • High complexity</span>
              </div>
              <div className={styles.activityTime}>15 mins ago</div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>⚡</div>
              <div className={styles.activityDetails}>
                <strong>Routed to qwen2.5:3b</strong>
                <span>Task: Code Documentation • Saved $0.03</span>
              </div>
              <div className={styles.activityTime}>1 hour ago</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
