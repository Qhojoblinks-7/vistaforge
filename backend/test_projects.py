import json
import urllib.request
import sys
import time

URL = "http://127.0.0.1:8000/graphql/"

def wait_for_server(max_attempts=30):
    """Wait for the server to be ready."""
    for attempt in range(max_attempts):
        try:
            req = urllib.request.Request(URL, data=json.dumps({"query": "{__typename}"}).encode('utf-8'), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status == 200:
                    print("Server is ready.")
                    return True
        except Exception:
            pass
        print(f"Waiting for server... attempt {attempt + 1}/{max_attempts}")
        time.sleep(2)
    print("Server did not start within the expected time.")
    return False

def graphql(query, variables=None, token=None):
    payload = json.dumps({"query": query, "variables": variables}).encode('utf-8')
    req = urllib.request.Request(URL, data=payload, headers={"Content-Type": "application/json"})
    if token:
        req.add_header('Authorization', f"JWT {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as exc:
        print('HTTP ERROR:', exc)
        try:
            if hasattr(exc, 'read'):
                print(exc.read())
        except Exception:
            pass
        sys.exit(1)

if __name__ == '__main__':
    # 1) Obtain token
    token_mutation = '''mutation TokenAuth($username:String!, $password:String!){ tokenAuth(username:$username,password:$password){ token } }'''
    vars = {"username": "dev_admin", "password": "DevPass123!"}
    print('Requesting token...')
    resp = graphql(token_mutation, vars)
    print(json.dumps(resp, indent=2))
    try:
        token = resp['data']['tokenAuth']['token']
    except Exception:
        print('Failed to get token; aborting')
        sys.exit(2)

    # 2) Create a client
    create_client_mutation = '''mutation CreateClient($input: ClientInput!){ createClient(input:$input){ client{ id name company contactEmail } } }'''
    client_input = {"name": "Test Client", "company": "Test Company", "contactEmail": "test@local"}
    print('\nCreating client...')
    resp = graphql(create_client_mutation, {"input": client_input}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        client_id = resp['data']['createClient']['client']['id']
    except Exception:
        print('Failed to create client; aborting')
        sys.exit(3)

    # 3) Create a project
    create_project_mutation = '''mutation CreateProject($input: ProjectInput!){ createProject(input:$input){ project{ id title totalTasks } } }'''
    project_input = {
        "title": "Test Project",
        "description": "A test project",
        "clientId": client_id,
        "status": "ACTIVE"
    }
    print('\nCreating project...')
    resp = graphql(create_project_mutation, {"input": project_input}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        project_id = resp['data']['createProject']['project']['id']
        initial_total_tasks = resp['data']['createProject']['project']['totalTasks']
        print(f'Initial totalTasks: {initial_total_tasks}')
    except Exception:
        print('Failed to create project; aborting')
        sys.exit(4)

    # 4) Create a task for the project
    create_task_mutation = '''mutation CreateProjectTask($projectId: ID!, $input: ProjectTaskInput!){ createProjectTask(projectId:$projectId, input:$input){ task{ id title } } }'''
    task_input = {
        "title": "Test Task",
        "description": "A test task",
        "status": "TODO"
    }
    print('\nCreating task...')
    resp = graphql(create_task_mutation, {"projectId": project_id, "input": task_input}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        task_id = resp['data']['createProjectTask']['task']['id']
    except Exception:
        print('Failed to create task; aborting')
        sys.exit(5)

    # 5) Query the project again to check totalTasks
    query_project = '''query GetProject($id: ID!){ project(id:$id){ id title totalTasks } }'''
    print('\nQuerying project after adding task...')
    resp = graphql(query_project, {"id": project_id}, token=token)
    print(json.dumps(resp, indent=2))
    try:
        updated_total_tasks = resp['data']['project']['totalTasks']
        print(f'Updated totalTasks: {updated_total_tasks}')
        if updated_total_tasks == 1:
            print('SUCCESS: totalTasks correctly updated to 1')
        else:
            print(f'FAILURE: Expected 1, got {updated_total_tasks}')
    except Exception:
        print('Failed to query project; aborting')
        sys.exit(6)

    print('\nProject test complete.')
