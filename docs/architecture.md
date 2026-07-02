# Architecture

TokenPilot is split into a backend routing service and a dashboard client.

## Backend

The backend receives chat requests, estimates token usage, chooses a provider/model, forwards the request, and records usage metadata.

## Dashboard

The dashboard is planned for monitoring usage, provider health, request latency, and routing decisions.

