# HaloCAS

## Project Overview

HaloCAS is an intelligent Collision Avoidance System designed for the manufacturing and mining industries. This system utilizes robust camera tracking on heavy machinery to calculate proximity and detect unsafe scenarios involving human workers.

Rather than relying on monolithic AI prompts, HaloCAS employs a deterministic graph-based execution engine. This ensures highly predictable, scalable, and safe responses in critical environments.

### Key Capabilities

1. **Intelligent State Checking**: Evaluates if the machine is active and moving before processing expensive computer vision tasks.
2. **Proximity & Trajectory Analysis**: Automatically flags incidents where a human worker is closer than the 10-meter safety threshold, and checks whether the machinery is moving towards them.
3. **Safety Gear Authentication**: Integrates with employee databases to verify if the worker has the required protective gear or authorization.
4. **Automated Alerting**: Generates clipped video segments of safety violations, runs a facial scan to identify the worker, and instantly emails the appropriate supervisor.

## Architecture Highlights

The architecture strictly decouples logic blocks into individual nodes mapped across an execution graph. For a detailed breakdown of the components, see `docs/architecture.md`.

## Prerequisites

- Python 3.10+
- A Google Cloud Project ID (if deploying the ADK Workflow online)
- Virtual Environment

## Installation & Setup

1. Clone this repository.
2. Set up your virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

The current project uses a local JSON file (`src/data/mock_db.json`) to mock the company directory and facial scan results. In a production scenario, you can replace the `EmployeeDatabaseNode` and `FaceScanNode` logic in `src/nodes/logic.py` with actual API calls to your HR and CV platforms.

## Execution

To execute the workflow and test the predefined scenarios:

```bash
python src/core/workflow.py
```

This will run three mock scenarios:
- Unsafe proximity with an unauthorized worker.
- Unsafe proximity with an authorized worker.
- Safe proximity.

Check the console output for the workflow traces and view generated mock clips in the `alerts/` folder.
