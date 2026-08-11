# HaloCAS Technical Architecture

This document maps out the system architecture and the lifecycle of a single camera frame as it traverses the HaloCAS logic pipeline.

## Component Flowchart

The system is designed as a pipeline where data traverses conditionally through specific nodes. Each node represents an isolated block of business logic.

```mermaid
graph TD
    A[Initial State / Frame Input] --> B[Machine State Node]
    
    B -->|Inactive / Stationary| Z[Halt: Safe]
    B -->|Active & Moving| C[Video Analysis Node]
    
    C -->|Distance >= 10m| Y[Halt: Safe Distance]
    C -->|Distance < 10m| D[Trajectory & Gear Node]
    
    D -->|Moving Away| X[Halt: Safe Trajectory]
    D -->|Moving Towards| E[Clipping Node]
    
    E -->|Extract MP4| F[Face Scan Node]
    
    F -->|Detect Face ID| G[Employee DB Node]
    
    G -->|Has Authorized Gear| W[Halt: False Alarm]
    G -->|No Authorized Gear| H[Notification Node]
    
    H -->|Dispatch Email + Clip| V[Incident Logged]
```

## Directory Structure Breakdown

- **`src/core/workflow.py`**: The main entry point. Defines the execution logic and orchestrates how state is passed from node to node.
- **`src/nodes/logic.py`**: Contains the individual Python functions representing the nodes in our flowchart. Each node returns a boolean instructing the graph whether to continue or halt, along with the modified state payload.
- **`src/data/mock_db.json`**: Acts as a stand-in for a live SQL/NoSQL employee database.
