 // GraphQL API service for communicating with Django backend
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'https://vistaforge.onrender.com/graphql/';

class GraphQLService {
    constructor() {
        this.graphqlURL = GRAPHQL_URL;
    }

    async request(query, variables = {}, options = {}) {
        console.log('API Request - Query:', query.substring(0, 100) + '...');
        console.log('API Request - Variables:', variables);

        // Always send Authorization header if token is present
        const token = localStorage.getItem('adminToken');
        console.log('API Request - Token present:', !!token);
        console.log('API Request - Token value:', token ? token.substring(0, 20) + '...' : 'null');

        // Build headers from options but ensure Authorization is set last so it cannot be
        // overridden by callers passing options.headers. Support options.skipAuth to
        // avoid attaching Authorization for requests like tokenAuth/login.
        const headers = Object.assign(
            { 'Content-Type': 'application/json' },
            options.headers || {}
        );

        if (!options.skipAuth && token) {
            // Use JWT token format for graphql_jwt middleware
            headers['Authorization'] = `JWT ${token}`;
        }

        const config = {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables,
            }),
            ...options,
        };

        // Log the headers we will actually send (mask token for privacy)
        console.log('API Request - Headers:', Object.keys(headers).reduce((acc, key) => {
            if (key.toLowerCase() === 'authorization' && headers[key]) {
                // Mask the token but preserve the 'JWT' prefix
                acc[key] = headers[key].replace(/^(JWT)\s+(.{20}).+$/, `$1 $2...`);
            } else {
                acc[key] = headers[key];
            }
            return acc;
        }, {}));

        try {
            console.log('API Request - About to fetch from URL:', this.graphqlURL);
            console.log('API Request - Full config:', {
                method: config.method,
                headers: config.headers,
                body: config.body ? JSON.parse(config.body) : null
            });

            const response = await fetch(this.graphqlURL, config);
            console.log('API Request - Response received:', {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('GraphQL Response:', result);

            // Handle Decimal serialization errors by converting them to numbers
            if (result.errors && result.errors.some(error => error.message.includes('Received not compatible Decimal'))) {
                console.warn('Decimal serialization issue detected, attempting to convert...');
                if (result.data) {
                    const convertDecimals = (obj) => {
                        if (obj === null || obj === undefined) return obj;
                        if (typeof obj === 'object') {
                            for (const key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (typeof obj[key] === 'string' && /^\d+(\.\d+)?$/.test(obj[key])) {
                                        obj[key] = parseFloat(obj[key]);
                                    } else if (typeof obj[key] === 'object') {
                                        convertDecimals(obj[key]);
                                    }
                                }
                            }
                        }
                        return obj;
                    };
                    convertDecimals(result.data);
                    console.log('Converted data:', result.data);
                    return result.data;
                }
            }

            // Handle successful responses with data that might contain Decimals
            if (result.data) {
                const convertDecimals = (obj) => {
                    if (obj === null || obj === undefined) return obj;
                    if (typeof obj === 'object') {
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                if (typeof obj[key] === 'string' && /^\d+(\.\d+)?$/.test(obj[key])) {
                                    obj[key] = parseFloat(obj[key]);
                                } else if (typeof obj[key] === 'object') {
                                    convertDecimals(obj[key]);
                                }
                            }
                        }
                    }
                    return obj;
                };
                convertDecimals(result.data);
                console.log('Processed data:', result.data);
            }

            if (result.errors) {
                console.error('GraphQL Errors:', result.errors);
                console.error('Full GraphQL Response:', result);
                const errorMessage = result.errors[0].message;

                // For this JWT setup, just throw the error since refresh tokens aren't supported
                if (errorMessage.includes('Authentication')) {
                    console.log('Authentication error - token may be expired');
                }
                throw new Error(errorMessage);
            }

            return result.data;
        } catch (error) {
            console.error('GraphQL request failed:', error);
            throw error;
        }
    }

    // Projects GraphQL API
    async getProjects(params = {}) {
        console.log('GraphQL Service: Fetching projects with params:', params);

        // Check if user is authenticated (has token)
        const token = localStorage.getItem('adminToken');
        const isAuthenticated = !!token;

        if (isAuthenticated) {
            // Admin access: use allManagementProjects for full access
            const query = `
                query GetAllManagementProjects {
                    allManagementProjects {
                        id
                        title
                        description
                        status
                        budget
                        startDate
                        endDate
                        createdAt
                        updatedAt
                        client {
                            id
                            name
                            company
                        }
                    }
                }
            `;

            const result = await this.request(query);
            console.log('GraphQL Service: Admin projects response:', result);
            return result.allManagementProjects;
        } else {
            // Public access: use allProjects query and request case-study fields
            const query = `
                query GetPublicProjects {
                    allProjects {
                        id
                        title
                        name
                        slug
                        intro
                        logo
                        clientType
                        industry
                        caseStudy
                        createdAt
                    }
                }
            `;

            const result = await this.request(query, {}, { skipAuth: true });
            console.log('GraphQL Service: Public projects response:', result);
            return result.allProjects;
        }
    }

    async getPublicProjects() {
        // Public access: use allProjects query and request case-study fields
        const query = `
            query GetPublicProjects {
                allProjects {
                    id
                    title
                    name
                    slug
                    intro
                    logo
                    clientType
                    industry
                    caseStudy
                    createdAt
                }
            }
        `;

        const result = await this.request(query, {}, { skipAuth: true });
        return result.allProjects;
    }

    async getProject(slug) {
        // For public access, we need to check if project is active
        // Since the backend filters by is_active=True for unauthenticated users,
        // this should work for public viewing
        const query = `
            query GetProject($slug: String!) {
                project(slug: $slug) {
                    id
                    title
                    name
                    slug
                    intro
                    logo
                    clientType
                    industry
                    caseStudy
                    createdAt
                    updatedAt
                }
            }
        `;

        const result = await this.request(query, { slug }, { skipAuth: true });
        return result.project;
    }

    async getFeaturedProjects() {
        // For public access, use allPublicProjects but limit to first 3
        const query = `
            query GetFeaturedProjects {
                allProjects {
                    id
                    title
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query);
        // Return first 3 projects as featured
        return result.allProjects.slice(0, 3);
    }

    async getDesignProjects() {
        // For public access, filter design projects from allPublicProjects
        const query = `
            query GetDesignProjects {
                allProjects {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query);
        // Note: Since we simplified the public type, we can't filter by design tools here
        // This would need to be handled on the backend if design project filtering is needed
        return result.allProjects;
    }

    // Authentication GraphQL API
    async login(credentials) {
        const mutation = `
            mutation TokenAuth($username: String!, $password: String!) {
                tokenAuth(username: $username, password: $password) {
                    token
                }
            }
        `;

    const result = await this.request(mutation, credentials, { skipAuth: true });

        // Store the token if login successful
        if (result.tokenAuth.token) {
            localStorage.setItem('adminToken', result.tokenAuth.token);
            // Note: refresh token not available in this JWT setup
        }

        return result.tokenAuth;
    }

    async logout() {
        // Clear tokens on logout
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        return { success: true };
    }

    // Note: Refresh token not available in this JWT setup
    async refreshToken() {
        throw new Error('Token refresh not supported in this JWT setup');
    }

    // Contact GraphQL API
    async submitContact(formData) {
        const mutation = `
            mutation SubmitContact($name: String!, $email: String!, $message: String!) {
                submitContact(name: $name, email: $email, message: $message) {
                    contactSubmission {
                        id
                        name
                        email
                        message
                        submittedAt
                    }
                }
            }
        `;

        const result = await this.request(mutation, formData);
        return result.submitContact.contactSubmission;
    }

    // Admin-only queries (require superuser authentication)
    async getAllContacts() {
        const query = `
            query GetAllContacts {
                allContacts {
                    id
                    name
                    email
                    message
                    submittedAt
                }
            }
        `;

        const result = await this.request(query);
        return result.allContacts;
    }

    async getUnreadContacts() {
        // Note: The private query doesn't have an unread filter, so we get all and filter client-side
        const query = `
            query GetAllContacts {
                allContacts {
                    id
                    name
                    email
                    message
                    submittedAt
                }
            }
        `;

        const result = await this.request(query);
        // Since we simplified the type, we can't filter by is_read here
        // This would need to be handled on the backend if unread filtering is needed
        return result.allContacts;
    }

    async getMe() {
        const query = `
            query GetMe {
                me {
                    id
                    username
                    email
                    isSuperuser
                }
            }
        `;

        const result = await this.request(query);
        return result.me;
    }

    // Admin-only mutations (require superuser authentication)
    async createProject(projectData) {
        const mutation = `
            mutation CreateProjectMutation($projectData: ProjectCreateInput!) {
                createProject(projectData: $projectData) {
                    project {
                        id
                        title
                        slug
                        clientType
                        industry
                        intro
                        logo
                        projectType
                        designTools
                        designToolsDisplay
                        isDesignProject
                        startingPoint
                        theTransformation
                        journeyEnd
                        visuals
                        deliverables
                        designSystem
                        isActive
                        order
                        createdAt
                        updatedAt
                    }
                    errors {
                        field
                        messages
                    }
                }
            }
        `;

        const variables = { projectData };
        const result = await this.request(mutation, variables);

        if (result.createProject.errors && result.createProject.errors.length > 0) {
            const errorMessage = result.createProject.errors.map(err => `${err.field}: ${err.messages.join(', ')}`).join('; ');
            throw new Error(`Project creation failed: ${errorMessage}`);
        }

        return result.createProject.project;
    }

    async updateProject(id, projectData) {
        const mutation = `
            mutation UpdateProjectMutation($id: ID!, $projectData: ProjectUpdateInput!) {
                updateProject(id: $id, projectData: $projectData) {
                    project {
                        id
                        title
                        name
                        slug
                        clientType
                        industry
                        intro
                        logo
                        projectType
                        designTools
                        designToolsDisplay
                        isDesignProject
                        startingPoint
                        theTransformation
                        journeyEnd
                        visuals
                        deliverables
                        designSystem
                        isActive
                        order
                        createdAt
                        updatedAt
                    }
                    errors {
                        field
                        messages
                    }
                }
            }
        `;

        const variables = { id, projectData };
        const result = await this.request(mutation, variables);

        if (result.updateProject.errors && result.updateProject.errors.length > 0) {
            const errorMessage = result.updateProject.errors.map(err => `${err.field}: ${err.messages.join(', ')}`).join('; ');
            throw new Error(`Project update failed: ${errorMessage}`);
        }

        return result.updateProject.project;
    }

    async deleteProject(id) {
        const mutation = `
            mutation DeleteProjectMutation($id: ID!) {
                deleteProject(id: $id) {
                    success
                    errors {
                        field
                        messages
                    }
                }
            }
        `;

        const variables = { id };
        const result = await this.request(mutation, variables);

        if (result.deleteProject.errors && result.deleteProject.errors.length > 0) {
            const errorMessage = result.deleteProject.errors.map(err => `${err.field}: ${err.messages.join(', ')}`).join('; ');
            throw new Error(`Project deletion failed: ${errorMessage}`);
        }

        return result.deleteProject.success;
    }

    // Task GraphQL API
    async getTasks(projectId = null) {
        const query = `
            query GetTasks($projectId: ID) {
                allTasks(projectId: $projectId) {
                    id
                    project {
                        id
                        title
                    }
                    title
                    status
                    assignedTo
                    description
                    order
                    createdAt
                    updatedAt
                }
            }
        `;

        const result = await this.request(query, { projectId });
        return result.allTasks;
    }

    async createTask(taskData) {
        const mutation = `
            mutation CreateTaskMutation($taskData: TaskCreateInput!) {
                createTask(taskData: $taskData) {
                    task {
                        id
                        project {
                            id
                            title
                        }
                        title
                        status
                        assignedTo
                        dueDate
                        description
                        order
                        createdAt
                        updatedAt
                    }
                    errors
                }
            }
        `;

        const result = await this.request(mutation, { taskData });

        if (result.createTask.errors && result.createTask.errors.length > 0) {
            throw new Error(`Task creation failed: ${result.createTask.errors.join(', ')}`);
        }

        return result.createTask.task;
    }

    async updateTask(id, taskData) {
        const mutation = `
            mutation UpdateProjectTaskMutation($id: ID!, $input: ProjectTaskInput!) {
                updateProjectTask(id: $id, input: $input) {
                    task {
                        id
                        project {
                            id
                            title
                        }
                        title
                        status
                        assignedTo
                        description
                        order
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const result = await this.request(mutation, { id, input: taskData });
        return result.updateProjectTask.task;
    }

    async deleteTask(id) {
        const mutation = `
            mutation DeleteTaskMutation($id: ID!) {
                deleteTask(id: $id) {
                    success
                    errors
                }
            }
        `;

        const result = await this.request(mutation, { id });

        if (result.deleteTask.errors && result.deleteTask.errors.length > 0) {
            throw new Error(`Task deletion failed: ${result.deleteTask.errors.join(', ')}`);
        }

        return result.deleteTask.success;
    }

    // Milestone GraphQL API
    async getMilestones(projectId = null) {
        console.log('GraphQL Service: Fetching milestones with projectId:', projectId);

        const query = `
            query GetMilestones($projectId: ID) {
                allMilestones(projectId: $projectId) {
                    id
                    project {
                        id
                        title
                    }
                    title
                    dueDate
                    isReached
                    description
                    order
                    createdAt
                    updatedAt
                }
            }
        `;

        const result = await this.request(query, { projectId });
        console.log('GraphQL Service: Milestones response:', result);
        return result.allMilestones;
    }

    async createMilestone(milestoneData) {
        const mutation = `
            mutation CreateMilestoneMutation($milestoneData: MilestoneCreateInput!) {
                createMilestone(milestoneData: $milestoneData) {
                    milestone {
                        id
                        project {
                            id
                            title
                        }
                        title
                        dueDate
                        isReached
                        description
                        order
                        createdAt
                        updatedAt
                    }
                    errors
                }
            }
        `;

        const result = await this.request(mutation, { milestoneData });

        if (result.createMilestone.errors && result.createMilestone.errors.length > 0) {
            throw new Error(`Milestone creation failed: ${result.createMilestone.errors.join(', ')}`);
        }

        return result.createMilestone.milestone;
    }

    async updateMilestone(id, milestoneData) {
        const mutation = `
            mutation UpdateMilestoneMutation($id: ID!, $milestoneData: MilestoneUpdateInput!) {
                updateMilestone(id: $id, milestoneData: $milestoneData) {
                    milestone {
                        id
                        project {
                            id
                            title
                        }
                        title
                        dueDate
                        isReached
                        description
                        order
                        createdAt
                        updatedAt
                    }
                    errors
                }
            }
        `;

        const result = await this.request(mutation, { id, milestoneData });

        if (result.updateMilestone.errors && result.updateMilestone.errors.length > 0) {
            throw new Error(`Milestone update failed: ${result.updateMilestone.errors.join(', ')}`);
        }

        return result.updateMilestone.milestone;
    }

    async deleteMilestone(id) {
        const mutation = `
            mutation DeleteMilestoneMutation($id: ID!) {
                deleteMilestone(id: $id) {
                    success
                    errors
                }
            }
        `;

        const result = await this.request(mutation, { id });

        if (result.deleteMilestone.errors && result.deleteMilestone.errors.length > 0) {
            throw new Error(`Milestone deletion failed: ${result.deleteMilestone.errors.join(', ')}`);
        }

        return result.deleteMilestone.success;
    }

    async getTimeLogs() {
      const query = `
        query GetTimeLogs {
          allTimeLogs {
            id
            client {
              id
              name
            }
            description
            taskName
            durationMinutes
            isBillable
            status
            startTime
            endTime
            createdAt
            updatedAt
          }
        }
      `;

      const result = await this.request(query);
      return result.allTimeLogs;
    }

    async getInvoices() {
      const query = `
        query GetInvoices {
          allInvoices {
            id
            invoiceNumber
            client {
              id
              name
            }
            project {
              id
              title
            }
            issueDate
            dueDate
            status
            subtotal
            tax
            discount
            total
            paidDate
            createdAt
            updatedAt
          }
        }
      `;

      const result = await this.request(query);
      return result.allInvoices;
    }
}

// Create and export a singleton instance
export default new GraphQLService();