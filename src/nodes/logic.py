import json
import random
import os

def load_db():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'mock_db.json')
    with open(db_path, 'r') as f:
        return json.load(f)


def machine_state_node(state: dict) -> dict:
    """Checks if the machine is switched on and actively moving."""
    print("[MachineStateNode] Checking machine state...")
    is_on = state.get("is_on", True)
    is_moving = state.get("is_moving", True)

    if not is_on or not is_moving:
        print("Machine is not active or moving. Halting workflow.")
        return {"continue": False, "reason": "Machine inactive/stationary"}

    print("Machine is active and moving. Proceeding.")
    return {"continue": True, "machine_state": state}


def video_analysis_node(state: dict) -> dict:
    """Analyzes the video to find humans and their distance."""
    print("[VideoAnalysisNode] Analyzing video for proximity...")
    distance = state.get("distance_to_person", 15)  # Default 15 meters

    if distance >= 10:
        print(
            f"Person detected at {distance}m. Distance is safe (>= 10m). Halting workflow.")
        return {"continue": False, "reason": "Distance safe"}

    print(
        f"Person detected at {distance}m! Distance is unsafe (< 10m). Proceeding.")
    state["unsafe_distance"] = distance
    return {"continue": True, "state": state}


def trajectory_gear_check_node(state: dict) -> dict:
    """Checks if machine is moving towards person and if they lack authorized gear."""
    print("[TrajectoryGearCheckNode] Checking trajectory and gear...")
    moving_towards = state.get("moving_towards_person", True)

    # We will verify gear from the employee DB later, but visually we might check here.
    # For now, let's just check trajectory.
    if not moving_towards:
        print("Machine is moving AWAY from the person. Halting workflow.")
        return {"continue": False, "reason": "Moving away"}

    print("Machine is moving TOWARDS the person. Proceeding.")
    return {"continue": True, "state": state}


def clipping_node(state: dict) -> dict:
    """Extracts a short video clip of the incident."""
    print("[ClippingNode] Extracting video clip...")
    clip_path = f"alerts/clip_{random.randint(1000, 9999)}.mp4"
    print(f"Clip extracted to {clip_path}")
    state["clip_path"] = clip_path
    return {"continue": True, "state": state}


def face_scan_node(state: dict) -> dict:
    """Scans the face in the clip to identify the individual."""
    print("[FaceScanNode] Scanning face in the clip...")
    # Mocking face ID detection. Let's assume we detect emp_002
    face_id = state.get("detected_face_id", "emp_002")
    print(f"Face scanned. Detected ID: {face_id}")
    state["face_id"] = face_id
    return {"continue": True, "state": state}


def employee_database_node(state: dict) -> dict:
    """Queries DB for individual's profile and supervisor."""
    print("[EmployeeDatabaseNode] Querying employee database...")
    db = load_db()
    face_id = state.get("face_id")

    emp_data = db.get(face_id)
    if not emp_data:
        print("Employee not found in DB!")
        state["emp_data"] = None
        return {"continue": True, "state": state}

    print(
        f"Found employee: {emp_data['name']} (Dept: {emp_data['department']})")

    if emp_data.get("has_authorized_gear"):
        print(f"Employee {emp_data['name']} has authorized gear. False alarm.")
        return {"continue": False, "reason": "Authorized gear present"}

    state["emp_data"] = emp_data
    return {"continue": True, "state": state}


def notification_node(state: dict) -> dict:
    """Sends email to supervisor with 'Safety Compromised' flag."""
    print("[NotificationNode] Preparing notification...")
    emp_data = state.get("emp_data")
    if not emp_data:
        print("No employee data to notify. Halting.")
        return {"continue": False, "reason": "No employee data"}

    supervisor = emp_data.get("supervisor_name")
    email = emp_data.get("supervisor_email")
    clip = state.get("clip_path")

    print("--- EMAIL DISPATCHED ---")
    print(f"To: {email} ({supervisor})")
    print(
        f"Subject: [SAFETY COMPROMISED] Proximity Alert for {emp_data['name']}")
    print(
        f"Body: A proximity violation was detected (<10m). Attached clip: {clip}")
    print("------------------------")

    return {"continue": True, "status": "Notified"}
