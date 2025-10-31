// GraphQL API service for communicating with Django backend
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql/';

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

        // DEBUG: Log all localStorage keys and values
        console.log('DEBUG - localStorage contents:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`  ${key}: ${value ? value.substring(0, 20) + '...' : 'null'}`);
        }

        // Build headers from options but ensure Authorization is set last so it cannot be
        // overridden by callers passing options.headers.
        const headers = Object.assign(
            { 'Content-Type': 'application/json' },
            options.headers || {}
        );

        if (token) {
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
            const response = await fetch(this.graphqlURL, config);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('GraphQL Response:', result);

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
                        images {
                            id
                            title
                            imageUrl
                            altText
                            order
                        }
                    }
                }
            `;

            const result = await this.request(query);
            console.log('GraphQL Service: Admin projects response:', result);
            return result.allManagementProjects;
        } else {
            // Public access: use allProjects query
            const query = `
                query GetPublicProjects {
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
            console.log('GraphQL Service: Public projects response:', result);
            return result.allProjects;
        }
    }

    async getProject(slug) {
        // For public access, we need to check if project is active
        // Since the backend filters by is_active=True for unauthenticated users,
        // this should work for public viewing
        const query = `
            query GetProject($slug: String!) {
                project(slug: $slug) {
                    id
                    name
                    slug
                    intro
                    createdAt
                }
            }
        `;

        const result = await this.request(query, { slug });
        return result.project;
    }

    async getFeaturedProjects() {
        // For public access, use allPublicProjects but limit to first 3
        const query = `
            query GetFeaturedProjects {
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

        const result = await this.request(mutation, credentials);

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
}

// Create and export a singleton instance
export default new GraphQLService();