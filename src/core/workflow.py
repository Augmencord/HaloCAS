import os
import sys

# Add src dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nodes.logic import (
    machine_state_node,
    video_analysis_node,
    trajectory_gear_check_node,
    clipping_node,
    face_scan_node,
    employee_database_node,
    notification_node
)


def run_workflow(initial_state: dict):
    print("=== STARTING HALOCAS WORKFLOW ===")

    # Node 1: Machine State
    res1 = machine_state_node(initial_state)
    if not res1.get("continue"):
        return res1
    state = res1.get("state", initial_state)

    # Node 2: Video Analysis
    res2 = video_analysis_node(state)
    if not res2.get("continue"):
        return res2
    state = res2.get("state", state)

    # Node 3: Trajectory & Gear Check
    res3 = trajectory_gear_check_node(state)
    if not res3.get("continue"):
        return res3
    state = res3.get("state", state)

    # Node 4: Clipping Node
    res4 = clipping_node(state)
    if not res4.get("continue"):
        return res4
    state = res4.get("state", state)

    # Node 5: Face Scan Node
    res5 = face_scan_node(state)
    if not res5.get("continue"):
        return res5
    state = res5.get("state", state)

    # Node 6: Employee DB Node
    res6 = employee_database_node(state)
    if not res6.get("continue"):
        return res6
    state = res6.get("state", state)

    # Node 7: Notification Node
    res7 = notification_node(state)

    print("=== WORKFLOW COMPLETED ===")
    return res7


if __name__ == "__main__":
    # Create alerts directory if not exists
    os.makedirs("alerts", exist_ok=True)

    # Test Scenario 1: Person < 10m, Machine On and moving towards, unauthorized person
    print("\n--- Running Test Scenario 1: Unsafe Proximity ---")
    unsafe_state = {
        "is_on": True,
        "is_moving": True,
        "distance_to_person": 5,
        "moving_towards_person": True,
        "detected_face_id": "emp_002"  # Alice, unauthorized gear
    }
    run_workflow(unsafe_state)

    # Test Scenario 2: Person < 10m, Machine On, but Authorized person
    print("\n--- Running Test Scenario 2: Authorized Person ---")
    auth_state = {
        "is_on": True,
        "is_moving": True,
        "distance_to_person": 4,
        "moving_towards_person": True,
        "detected_face_id": "emp_001"  # John, authorized gear
    }
    run_workflow(auth_state)

    # Test Scenario 3: Person > 10m
    print("\n--- Running Test Scenario 3: Safe Distance ---")
    safe_state = {
        "is_on": True,
        "is_moving": True,
        "distance_to_person": 15
    }
    run_workflow(safe_state)
